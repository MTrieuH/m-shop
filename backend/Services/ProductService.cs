using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class ProductService
    {
        private readonly AppDbContext _db;

        public ProductService(AppDbContext db) => _db = db;

        public async Task<PaginatedResult<ProductListDto>> GetProducts(
            string? categorySlug = null,
            string? search = null,
            string? brand = null,
            string? grade = null,
            string? series = null,
            string? scale = null,
            string? stockStatus = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            string? sort = null,
            int page = 1,
            int pageSize = 12)
        {
            var query = _db.Products.Include(p => p.Category).AsQueryable();

            // Filter by category (including children)
            if (!string.IsNullOrEmpty(categorySlug))
            {
                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
                if (category != null)
                {
                    var categoryIds = await GetCategoryAndChildrenIds(category.Id);
                    query = query.Where(p => categoryIds.Contains(p.CategoryId));
                }
            }

            // Search
            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));

            // Extract Available Filters BEFORE applying specific attribute filters
            var availableFilters = new
            {
                Brands = await query.Where(p => p.Brand != null).Select(p => p.Brand).Distinct().ToListAsync(),
                Grades = await query.Where(p => p.Grade != null && p.Grade != "N/A").Select(p => p.Grade).Distinct().ToListAsync(),
                Series = await query.Where(p => p.Series != null).Select(p => p.Series).Distinct().ToListAsync(),
                Scales = await query.Where(p => p.Scale != null && p.Scale != "N/A").Select(p => p.Scale).Distinct().ToListAsync()
            };

            // Filters
            if (!string.IsNullOrEmpty(brand))
            {
                var brands = brand.Split(',', StringSplitOptions.RemoveEmptyEntries);
                query = query.Where(p => brands.Contains(p.Brand));
            }
            if (!string.IsNullOrEmpty(grade))
            {
                var grades = grade.Split(',', StringSplitOptions.RemoveEmptyEntries);
                query = query.Where(p => grades.Contains(p.Grade));
            }
            if (!string.IsNullOrEmpty(series))
            {
                var seriesList = series.Split(',', StringSplitOptions.RemoveEmptyEntries);
                query = query.Where(p => seriesList.Contains(p.Series));
            }
            if (!string.IsNullOrEmpty(scale))
            {
                var scales = scale.Split(',', StringSplitOptions.RemoveEmptyEntries);
                query = query.Where(p => scales.Contains(p.Scale));
            }
            if (!string.IsNullOrEmpty(stockStatus))
            {
                if (stockStatus == "LowStock")
                    query = query.Where(p => p.StockStatus == "InStock" && p.Quantity > 0 && p.Quantity <= 5);
                else
                    query = query.Where(p => p.StockStatus == stockStatus);
            }
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            // Sort
            query = sort switch
            {
                "price-asc" => query.OrderBy(p => p.Price),
                "price-desc" => query.OrderByDescending(p => p.Price),
                "name-asc" => query.OrderBy(p => p.Name),
                "name-desc" => query.OrderByDescending(p => p.Name),
                "rating" => query.OrderByDescending(p => p.Rating),
                "popular" => query.OrderByDescending(p => p.ReviewCount),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Slug = p.Slug,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    ImageUrl = p.ImageUrl,
                    Brand = p.Brand,
                    Series = p.Series,
                    Grade = p.Grade,
                    Scale = p.Scale,
                    StockStatus = p.StockStatus,
                    Quantity = p.Quantity,
                    IsFeatured = p.IsFeatured,
                    IsNewArrival = p.IsNewArrival,
                    IsPreorder = p.IsPreorder,
                    IsSale = p.IsSale,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount
                })
                .ToListAsync();

            return new PaginatedResult<ProductListDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                AvailableFilters = availableFilters
            };
        }

        public async Task<ProductDetailDto?> GetBySlug(string slug)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null) return null;

            var images = new List<string> { product.ImageUrl };
            if (!string.IsNullOrEmpty(product.Images))
            {
                try
                {
                    var extra = System.Text.Json.JsonSerializer.Deserialize<List<string>>(product.Images);
                    if (extra != null) images.AddRange(extra);
                }
                catch { }
            }

            return new ProductDetailDto
            {
                Id = product.Id,
                Name = product.Name,
                Slug = product.Slug,
                Description = product.Description,
                Price = product.Price,
                OriginalPrice = product.OriginalPrice,
                ImageUrl = product.ImageUrl,
                Images = images,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                CategorySlug = product.Category.Slug,
                Brand = product.Brand,
                Series = product.Series,
                Grade = product.Grade,
                Scale = product.Scale,
                Condition = product.Condition,
                StockStatus = product.StockStatus,
                Quantity = product.Quantity,
                IsFeatured = product.IsFeatured,
                IsNewArrival = product.IsNewArrival,
                IsPreorder = product.IsPreorder,
                IsSale = product.IsSale,
                Rating = product.Rating,
                ReviewCount = product.ReviewCount
            };
        }

        public async Task<List<ProductListDto>> GetFeatured(int count = 8)
        {
            return await _db.Products.Where(p => p.IsFeatured)
                .OrderByDescending(p => p.Rating)
                .Take(count)
                .Select(p => new ProductListDto
                {
                    Id = p.Id, Name = p.Name, Slug = p.Slug, Price = p.Price,
                    OriginalPrice = p.OriginalPrice, ImageUrl = p.ImageUrl,
                    Brand = p.Brand, Series = p.Series, Grade = p.Grade, Scale = p.Scale,
                    StockStatus = p.StockStatus, Quantity = p.Quantity,
                    IsFeatured = p.IsFeatured, IsNewArrival = p.IsNewArrival,
                    IsPreorder = p.IsPreorder, IsSale = p.IsSale,
                    Rating = p.Rating, ReviewCount = p.ReviewCount
                }).ToListAsync();
        }

        public async Task<List<ProductListDto>> GetNewArrivals(int count = 8)
        {
            return await _db.Products.OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .Select(p => new ProductListDto
                {
                    Id = p.Id, Name = p.Name, Slug = p.Slug, Price = p.Price,
                    OriginalPrice = p.OriginalPrice, ImageUrl = p.ImageUrl,
                    Brand = p.Brand, Series = p.Series, Grade = p.Grade, Scale = p.Scale,
                    StockStatus = p.StockStatus, Quantity = p.Quantity,
                    IsFeatured = p.IsFeatured, IsNewArrival = p.IsNewArrival,
                    IsPreorder = p.IsPreorder, IsSale = p.IsSale,
                    Rating = p.Rating, ReviewCount = p.ReviewCount
                }).ToListAsync();
        }

        public async Task<List<ProductListDto>> GetRelated(int productId, int count = 4)
        {
            var product = await _db.Products.FindAsync(productId);
            if (product == null) return new();

            return await _db.Products
                .Where(p => p.CategoryId == product.CategoryId && p.Id != productId)
                .OrderByDescending(p => p.Rating)
                .Take(count)
                .Select(p => new ProductListDto
                {
                    Id = p.Id, Name = p.Name, Slug = p.Slug, Price = p.Price,
                    OriginalPrice = p.OriginalPrice, ImageUrl = p.ImageUrl,
                    Brand = p.Brand, Series = p.Series, Grade = p.Grade, Scale = p.Scale,
                    StockStatus = p.StockStatus, Quantity = p.Quantity,
                    IsFeatured = p.IsFeatured, IsNewArrival = p.IsNewArrival,
                    IsPreorder = p.IsPreorder, IsSale = p.IsSale,
                    Rating = p.Rating, ReviewCount = p.ReviewCount
                }).ToListAsync();
        }

        private async Task<List<int>> GetCategoryAndChildrenIds(int categoryId)
        {
            var ids = new List<int> { categoryId };
            var childIds = await _db.Categories.Where(c => c.ParentId == categoryId).Select(c => c.Id).ToListAsync();
            foreach (var childId in childIds)
            {
                ids.AddRange(await GetCategoryAndChildrenIds(childId));
            }
            return ids;
        }

        public async Task<object> GetSuggestions(string query, int count = 5)
        {
            var results = await _db.Products
                .Include(p => p.Category)
                .Where(p => p.Name.Contains(query) || (p.Brand != null && p.Brand.Contains(query)))
                .OrderByDescending(p => p.Rating)
                .Take(count)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Slug,
                    p.Price,
                    p.ImageUrl,
                    p.Grade,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();
            return results;
        }

    }
}
