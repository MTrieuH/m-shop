using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class AdminService
    {
        private readonly AppDbContext _db;
        public AdminService(AppDbContext db) => _db = db;

        // ============ Dashboard ============
        public async Task<DashboardDto> GetDashboard()
        {
            var totalProducts = await _db.Products.CountAsync();
            var totalOrders = await _db.Orders.CountAsync();
            var totalUsers = await _db.Users.CountAsync();
            var totalRevenue = await _db.Orders.Where(o => o.Status != "Cancelled")
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
            var pendingOrders = await _db.Orders.CountAsync(o => o.Status == "Pending");
            var lowStockProducts = await _db.Products.CountAsync(p => p.Quantity <= 5 && p.StockStatus == "InStock");
            var lowStockList = await _db.Products
                .Where(p => p.Quantity <= 5 && p.StockStatus == "InStock")
                .OrderBy(p => p.Quantity)
                .Take(5)
                .Select(p => new ProductListDto
                {
                    Id = p.Id, Name = p.Name, Slug = p.Slug, Price = p.Price,
                    ImageUrl = p.ImageUrl ?? "", Quantity = p.Quantity, Brand = p.Brand,
                    StockStatus = p.StockStatus
                })
                .ToListAsync();

            var now = DateTime.UtcNow;
            var sixMonthsAgo = now.AddMonths(-6);

            var rawMonthly = await _db.Orders
                .Where(o => o.CreatedAt >= sixMonthsAgo && o.Status != "Cancelled")
                .GroupBy(o => new { o.CreatedAt.Year, o.CreatedAt.Month })
                .Select(g => new { g.Key.Year, g.Key.Month, Revenue = g.Sum(o => o.TotalAmount), Orders = g.Count() })
                .ToListAsync();

            var monthlyRevenue = rawMonthly
                .OrderBy(m => m.Year).ThenBy(m => m.Month)
                .Select(m => new MonthlyRevenueDto { Month = $"{m.Month:00}/{m.Year}", Revenue = m.Revenue, Orders = m.Orders })
                .ToList();

            var recentOrders = await _db.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id, OrderCode = o.OrderCode, FullName = o.FullName,
                    Phone = o.Phone, Address = o.Address, TotalAmount = o.TotalAmount,
                    Status = o.Status, PaymentMethod = o.PaymentMethod, Note = o.Note,
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemResponseDto
                    {
                        ProductId = i.ProductId, ProductName = i.Product.Name,
                        ProductImage = i.Product.ImageUrl, Price = i.Price, Quantity = i.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return new DashboardDto
            {
                TotalProducts = totalProducts, TotalOrders = totalOrders,
                TotalUsers = totalUsers, TotalRevenue = totalRevenue,
                PendingOrders = pendingOrders, LowStockProducts = lowStockProducts,
                LowStockList = lowStockList, RecentOrders = recentOrders, 
                MonthlyRevenue = monthlyRevenue
            };
        }

        // ============ Products CRUD ============
        public async Task<PaginatedResult<ProductListDto>> GetAllProducts(string? search, int page, int pageSize)
        {
            var query = _db.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search) || p.Slug.Contains(search) || (p.Brand != null && p.Brand.Contains(search)));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(p => new ProductListDto
                {
                    Id = p.Id, Name = p.Name, Slug = p.Slug, Price = p.Price,
                    OriginalPrice = p.OriginalPrice, ImageUrl = p.ImageUrl ?? "",
                    Images = p.Images, Description = p.Description, CategoryId = p.CategoryId,
                    Brand = p.Brand, Series = p.Series, Grade = p.Grade, Scale = p.Scale, Condition = p.Condition,
                    StockStatus = p.StockStatus, Quantity = p.Quantity,
                    IsFeatured = p.IsFeatured, IsNewArrival = p.IsNewArrival,
                    IsPreorder = p.IsPreorder, IsSale = p.IsSale,
                    Rating = p.Rating, ReviewCount = p.ReviewCount
                })
                .ToListAsync();

            return new PaginatedResult<ProductListDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<Product> CreateProduct(AdminProductDto dto)
        {
            var slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Name) : dto.Slug;
            slug = await EnsureUniqueSlug(slug);

            var product = new Product
            {
                Name = dto.Name, Slug = slug, Description = dto.Description,
                Price = dto.Price, OriginalPrice = dto.OriginalPrice,
                ImageUrl = dto.ImageUrl, Images = dto.Images,
                CategoryId = dto.CategoryId, Brand = dto.Brand, Series = dto.Series,
                Grade = dto.Grade, Scale = dto.Scale, Condition = dto.Condition,
                StockStatus = dto.StockStatus, Quantity = dto.Quantity,
                IsFeatured = dto.IsFeatured, IsNewArrival = dto.IsNewArrival,
                IsPreorder = dto.IsPreorder, IsSale = dto.IsSale,
                CreatedAt = DateTime.UtcNow
            };
            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateProduct(int id, AdminProductDto dto)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return null;

            var slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Name) : dto.Slug;
            if (slug != product.Slug) slug = await EnsureUniqueSlug(slug, id);

            product.Name = dto.Name; product.Slug = slug; product.Description = dto.Description;
            product.Price = dto.Price; product.OriginalPrice = dto.OriginalPrice;
            product.ImageUrl = dto.ImageUrl; product.Images = dto.Images;
            product.CategoryId = dto.CategoryId; product.Brand = dto.Brand; product.Series = dto.Series;
            product.Grade = dto.Grade; product.Scale = dto.Scale; product.Condition = dto.Condition;
            product.StockStatus = dto.StockStatus; product.Quantity = dto.Quantity;
            product.IsFeatured = dto.IsFeatured; product.IsNewArrival = dto.IsNewArrival;
            product.IsPreorder = dto.IsPreorder; product.IsSale = dto.IsSale;

            await _db.SaveChangesAsync();
            return product;
        }

        private string GenerateSlug(string name)
        {
            var s = name.ToLowerInvariant();
            s = System.Text.RegularExpressions.Regex.Replace(s, @"[^a-z0-9\s-]", "");
            s = System.Text.RegularExpressions.Regex.Replace(s, @"[\s-]+", " ").Trim();
            s = System.Text.RegularExpressions.Regex.Replace(s, @"\s", "-");
            return s;
        }

        private async Task<string> EnsureUniqueSlug(string slug, int? excludeId = null)
        {
            var originalSlug = slug;
            var count = 1;
            while (await _db.Products.AnyAsync(p => p.Slug == slug && (!excludeId.HasValue || p.Id != excludeId)))
            {
                slug = $"{originalSlug}-{count++}";
            }
            return slug;
        }

        public async Task<bool> DeleteProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return false;
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return true;
        }

        // ============ Orders ============
        public async Task<PaginatedResult<OrderResponseDto>> GetAllOrders(string? status, int page, int pageSize)
        {
            var query = _db.Orders.Include(o => o.Items).ThenInclude(i => i.Product).AsQueryable();
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(o => o.Status == status);

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id, OrderCode = o.OrderCode, FullName = o.FullName,
                    Phone = o.Phone, Address = o.Address, TotalAmount = o.TotalAmount,
                    Status = o.Status, PaymentMethod = o.PaymentMethod, Note = o.Note,
                    CreatedAt = o.CreatedAt,
                    Items = o.Items.Select(i => new OrderItemResponseDto
                    {
                        ProductId = i.ProductId, ProductName = i.Product.Name,
                        ProductImage = i.Product.ImageUrl, Price = i.Price, Quantity = i.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return new PaginatedResult<OrderResponseDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<OrderResponseDto?> UpdateOrderStatus(int id, string status)
        {
            var validStatuses = new[] { "Pending", "Confirmed", "Shipping", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(status)) return null;

            var order = await _db.Orders.Include(o => o.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return null;

            // Handle Revert Inventory if Cancelled
            if (status == "Cancelled" && (order.Status == "Pending" || order.Status == "Confirmed" || order.Status == "Shipping" || order.Status == "Delivered"))
            {
                foreach (var item in order.Items)
                {
                    if (item.Product != null)
                    {
                        item.Product.Quantity += item.Quantity;
                        if (item.Product.Quantity > 0 && item.Product.StockStatus == "OutOfStock")
                            item.Product.StockStatus = "InStock";
                    }
                }
            }

            order.Status = status;
            await _db.SaveChangesAsync();

            return new OrderResponseDto
            {
                Id = order.Id, OrderCode = order.OrderCode, FullName = order.FullName,
                Phone = order.Phone, Address = order.Address, TotalAmount = order.TotalAmount,
                Status = order.Status, PaymentMethod = order.PaymentMethod, Note = order.Note,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemResponseDto
                {
                    ProductId = i.ProductId, ProductName = i.Product.Name,
                    ProductImage = i.Product.ImageUrl, Price = i.Price, Quantity = i.Quantity
                }).ToList()
            };
        }

        // ============ Users ============
        public async Task<PaginatedResult<UserDto>> GetAllUsers(int page, int pageSize)
        {
            var total = await _db.Users.CountAsync();
            var items = await _db.Users
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id, Email = u.Email, FullName = u.FullName,
                    Phone = u.Phone, Address = u.Address, Role = u.Role
                })
                .ToListAsync();

            return new PaginatedResult<UserDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<bool> UpdateUserRole(int userId, string role)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return false;
            user.Role = role;
            await _db.SaveChangesAsync();
            return true;
        }

        // ============ Categories CRUD ============
        public async Task<List<CategoryDto>> GetAllCategoriesFlat()
        {
            return await _db.Categories
                .OrderBy(c => c.ParentId).ThenBy(c => c.SortOrder)
                .Select(c => new CategoryDto
                {
                    Id = c.Id, Name = c.Name, Slug = c.Slug,
                    Description = c.Description, ImageUrl = c.ImageUrl,
                    ParentId = c.ParentId, SortOrder = c.SortOrder
                })
                .ToListAsync();
        }

        public async Task<Category> CreateCategory(AdminCategoryDto dto)
        {
            var cat = new Category
            {
                Name = dto.Name, Slug = dto.Slug, Description = dto.Description,
                ImageUrl = dto.ImageUrl, ParentId = dto.ParentId,
                SortOrder = dto.SortOrder, IsActive = dto.IsActive
            };
            _db.Categories.Add(cat);
            await _db.SaveChangesAsync();
            return cat;
        }

        public async Task<Category?> UpdateCategory(int id, AdminCategoryDto dto)
        {
            var cat = await _db.Categories.FindAsync(id);
            if (cat == null) return null;

            cat.Name = dto.Name; cat.Slug = dto.Slug; cat.Description = dto.Description;
            cat.ImageUrl = dto.ImageUrl; cat.ParentId = dto.ParentId;
            cat.SortOrder = dto.SortOrder; cat.IsActive = dto.IsActive;

            await _db.SaveChangesAsync();
            return cat;
        }

        public async Task<bool> DeleteCategory(int id)
        {
            var cat = await _db.Categories.FindAsync(id);
            if (cat == null) return false;
            _db.Categories.Remove(cat);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
