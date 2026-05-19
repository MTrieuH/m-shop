using Microsoft.AspNetCore.Mvc;
using MShop.API.Services;

namespace MShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _products;

        public ProductsController(ProductService products) => _products = products;

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? category,
            [FromQuery] string? search,
            [FromQuery] string? brand,
            [FromQuery] string? grade,
            [FromQuery] string? series,
            [FromQuery] string? scale,
            [FromQuery] string? stockStatus,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sort,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var result = await _products.GetProducts(category, search, brand, grade, series, scale, stockStatus, minPrice, maxPrice, sort, page, pageSize);
            return Ok(result);
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _products.GetBySlug(slug);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm." });
            return Ok(product);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured([FromQuery] int count = 8)
        {
            var products = await _products.GetFeatured(count);
            return Ok(products);
        }

        [HttpGet("new-arrivals")]
        public async Task<IActionResult> GetNewArrivals([FromQuery] int count = 8)
        {
            var products = await _products.GetNewArrivals(count);
            return Ok(products);
        }

        [HttpGet("{id:int}/related")]
        public async Task<IActionResult> GetRelated(int id, [FromQuery] int count = 4)
        {
            var products = await _products.GetRelated(id, count);
            return Ok(products);
        }

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2) return Ok(Array.Empty<object>());
            var results = await _products.GetSuggestions(q, 5);
            return Ok(results);
        }
    }
}
