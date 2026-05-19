using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;

namespace MShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _db.Categories
                .Where(c => c.IsActive && c.ParentId == null)
                .OrderBy(c => c.SortOrder)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ParentId = c.ParentId,
                    SortOrder = c.SortOrder,
                    Children = c.Children.Where(ch => ch.IsActive).OrderBy(ch => ch.SortOrder).Select(ch => new CategoryDto
                    {
                        Id = ch.Id,
                        Name = ch.Name,
                        Slug = ch.Slug,
                        Description = ch.Description,
                        ImageUrl = ch.ImageUrl,
                        ParentId = ch.ParentId,
                        SortOrder = ch.SortOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var category = await _db.Categories
                .Where(c => c.Slug == slug && c.IsActive)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    ParentId = c.ParentId,
                    SortOrder = c.SortOrder,
                    Children = c.Children.Where(ch => ch.IsActive).OrderBy(ch => ch.SortOrder).Select(ch => new CategoryDto
                    {
                        Id = ch.Id,
                        Name = ch.Name,
                        Slug = ch.Slug,
                        Description = ch.Description,
                        ImageUrl = ch.ImageUrl,
                        ParentId = ch.ParentId,
                        SortOrder = ch.SortOrder
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục." });

            return Ok(category);
        }
    }
}
