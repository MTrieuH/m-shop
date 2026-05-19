using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Middleware;
using MShop.API.Models;
using MShop.API.Services;
using System.Security.Claims;

namespace MShop.API.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _db;
        public WishlistController(AppDbContext db) => _db = db;

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = GetUserId();
            var items = await _db.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new ProductListDto
                {
                    Id = w.Product.Id, Name = w.Product.Name, Slug = w.Product.Slug,
                    Price = w.Product.Price, OriginalPrice = w.Product.OriginalPrice,
                    ImageUrl = w.Product.ImageUrl, Brand = w.Product.Brand,
                    Grade = w.Product.Grade, StockStatus = w.Product.StockStatus,
                    IsFeatured = w.Product.IsFeatured, IsNewArrival = w.Product.IsNewArrival,
                    IsPreorder = w.Product.IsPreorder, IsSale = w.Product.IsSale,
                    Rating = w.Product.Rating, ReviewCount = w.Product.ReviewCount
                })
                .ToListAsync();
            return Ok(items);
        }

        [HttpPost("{productId}")]
        public async Task<IActionResult> Add(int productId)
        {
            var userId = GetUserId();
            var exists = await _db.Wishlists.AnyAsync(w => w.UserId == userId && w.ProductId == productId);
            if (exists) return Ok(new { message = "Đã có trong danh sách yêu thích." });
            _db.Wishlists.Add(new Wishlist { UserId = userId, ProductId = productId });
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã thêm vào danh sách yêu thích." });
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Remove(int productId)
        {
            var userId = GetUserId();
            var item = await _db.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (item != null) { _db.Wishlists.Remove(item); await _db.SaveChangesAsync(); }
            return Ok(new { message = "Đã xóa khỏi danh sách yêu thích." });
        }
    }

    // ============ Coupon Controller ============
    [ApiController]
    [Route("api/coupons")]
    public class CouponController : ControllerBase
    {
        private readonly CouponService _coupon;
        public CouponController(CouponService coupon) => _coupon = coupon;

        [HttpPost("validate")]
        public async Task<IActionResult> Validate([FromBody] ValidateCouponDto dto)
        {
            var (valid, message, discount) = await _coupon.ValidateCoupon(dto.Code, dto.OrderTotal);
            return Ok(new { valid, message, discount });
        }

        [HttpGet, AdminOnly]
        public async Task<IActionResult> GetAll()
        {
            var coupons = await _coupon.GetAll();
            return Ok(coupons);
        }

        [HttpPost, AdminOnly]
        public async Task<IActionResult> Create([FromBody] Coupon coupon)
        {
            var created = await _coupon.Create(coupon);
            return Ok(new { message = "Tạo mã giảm giá thành công.", id = created.Id });
        }

        [HttpDelete("{id}"), AdminOnly]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _coupon.Delete(id);
            if (!ok) return NotFound();
            return Ok(new { message = "Xóa mã giảm giá thành công." });
        }
    }

    // ============ Image Upload Controller ============
    [ApiController]
    [Route("api/images")]
    public class ImageController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        public ImageController(IWebHostEnvironment env) => _env = env;

        [HttpPost("upload"), AdminOnly]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { message = "Không có file." });
            if (file.Length > 5 * 1024 * 1024) return BadRequest(new { message = "File tối đa 5MB." });

            var allowedExts = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExts.Contains(ext)) return BadRequest(new { message = "Chỉ chấp nhận file ảnh." });

            var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "images", "uploads");
            Directory.CreateDirectory(uploadPath);

            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Ok(new { url = $"/images/uploads/{fileName}" });
        }
    }

    // ============ Blog Controller ============
    [ApiController]
    [Route("api/blogs")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BlogController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetPublished()
        {
            var blogs = await _db.Blogs.Where(b => b.IsPublished)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new { b.Id, b.Title, b.Slug, b.Summary, b.ImageUrl, b.CreatedAt })
                .ToListAsync();
            return Ok(blogs);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var blog = await _db.Blogs.Include(b => b.Author).FirstOrDefaultAsync(b => b.Slug == slug && b.IsPublished);
            if (blog == null) return NotFound();
            return Ok(new { blog.Id, blog.Title, blog.Slug, blog.Summary, blog.Content, blog.ImageUrl, blog.CreatedAt, Author = blog.Author.FullName });
        }

        [HttpGet("admin"), AdminOnly]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _db.Blogs.Include(b => b.Author).OrderByDescending(b => b.CreatedAt).ToListAsync();
            return Ok(blogs.Select(b => new { b.Id, b.Title, b.Slug, b.Summary, b.ImageUrl, b.IsPublished, b.CreatedAt, Author = b.Author.FullName }));
        }

        [HttpPost, AdminOnly]
        public async Task<IActionResult> Create([FromBody] Blog blog)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            blog.AuthorId = userId;
            _db.Blogs.Add(blog);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tạo bài viết thành công.", id = blog.Id });
        }

        [HttpPut("{id}"), AdminOnly]
        public async Task<IActionResult> Update(int id, [FromBody] Blog updated)
        {
            var blog = await _db.Blogs.FindAsync(id);
            if (blog == null) return NotFound();
            blog.Title = updated.Title; blog.Slug = updated.Slug; blog.Summary = updated.Summary;
            blog.Content = updated.Content; blog.ImageUrl = updated.ImageUrl; blog.IsPublished = updated.IsPublished;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công." });
        }

        [HttpDelete("{id}"), AdminOnly]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _db.Blogs.FindAsync(id);
            if (blog == null) return NotFound();
            _db.Blogs.Remove(blog);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công." });
        }
    }

    // ============ Store Event Controller ============
    [ApiController]
    [Route("api/events")]
    public class StoreEventController : ControllerBase
    {
        private readonly AppDbContext _db;
        public StoreEventController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetPublished([FromQuery] string? type)
        {
            var query = _db.StoreEvents.Where(e => e.IsPublished).AsQueryable();
            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(e => e.Type == type);
            var events = await query.OrderBy(e => e.StartDate).ToListAsync();
            return Ok(events);
        }
    }

    [ApiController]
    [Route("api/admin/events")]
    [StaffOnly]
    public class AdminStoreEventController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminStoreEventController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _db.StoreEvents.OrderByDescending(e => e.CreatedAt).ToListAsync();
            return Ok(events);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MShop.API.Models.StoreEvent ev)
        {
            _db.StoreEvents.Add(ev);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tạo sự kiện thành công.", id = ev.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MShop.API.Models.StoreEvent updated)
        {
            var ev = await _db.StoreEvents.FindAsync(id);
            if (ev == null) return NotFound();
            ev.Title = updated.Title; ev.Description = updated.Description;
            ev.Type = updated.Type; ev.Status = updated.Status;
            ev.StartDate = updated.StartDate; ev.EndDate = updated.EndDate;
            ev.ImageUrl = updated.ImageUrl; ev.BadgeText = updated.BadgeText;
            ev.LinkUrl = updated.LinkUrl; ev.IsPublished = updated.IsPublished;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Cập nhật sự kiện thành công." });
        }

        [AdminOnly]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _db.StoreEvents.FindAsync(id);
            if (ev == null) return NotFound();
            _db.StoreEvents.Remove(ev);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Xóa sự kiện thành công." });
        }
    }

    // ============ Product Question Controller ============
    [ApiController]
    [Route("api/products/{productId}/questions")]
    public class ProductQuestionController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProductQuestionController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetQuestions(int productId)
        {
            var questions = await _db.ProductQuestions
                .Where(q => q.ProductId == productId)
                .Include(q => q.User)
                .Include(q => q.AnsweredBy)
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new {
                    q.Id, q.Content, q.Answer, q.CreatedAt, q.AnsweredAt,
                    q.UserId,
                    UserName = q.User.FullName,
                    AnsweredByName = q.AnsweredBy != null ? q.AnsweredBy.FullName : null
                }).ToListAsync();
            return Ok(questions);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostQuestion(int productId, [FromBody] PostQuestionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Content)) return BadRequest(new { message = "Nội dung không được rỗng." });
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var q = new ProductQuestion { ProductId = productId, UserId = userId, Content = dto.Content };
            _db.ProductQuestions.Add(q);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã gửi câu hỏi." });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var q = await _db.ProductQuestions.FindAsync(id);
            if (q == null) return NotFound();
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (q.UserId != userId && role != "Admin") return Forbid();
            _db.ProductQuestions.Remove(q);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}/answer")]
        [StaffOnly]
        public async Task<IActionResult> AnswerQuestion(int id, [FromBody] PostQuestionDto dto)
        {
            var q = await _db.ProductQuestions.FindAsync(id);
            if(q == null) return NotFound();
            var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            q.Answer = dto.Content;
            q.AnsweredById = adminId;
            q.AnsweredAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật câu trả lời." });
        }
    }
}

namespace MShop.API.DTOs
{
    public class ValidateCouponDto
    {
        public string Code { get; set; } = string.Empty;
        public decimal OrderTotal { get; set; }
    }

    public class PostQuestionDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
