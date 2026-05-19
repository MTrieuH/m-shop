using Microsoft.AspNetCore.Mvc;
using MShop.API.DTOs;
using MShop.API.Middleware;
using MShop.API.Services;

namespace MShop.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [StaffOnly]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _admin;
        public AdminController(AdminService admin) => _admin = admin;

        // ---- Dashboard ----
        [AdminOnly]
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var stats = await _admin.GetDashboard();
            return Ok(stats);
        }

        // ---- Products CRUD ----
        [HttpGet("products")]
        public async Task<IActionResult> GetProducts([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _admin.GetAllProducts(search, page, pageSize);
            return Ok(result);
        }

        [AdminOnly]
        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] AdminProductDto dto)
        {
            try
            {
                var product = await _admin.CreateProduct(dto);
                return Ok(new { message = "Tạo sản phẩm thành công.", id = product.Id });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] AdminProductDto dto)
        {
            var product = await _admin.UpdateProduct(id, dto);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm." });
            return Ok(new { message = "Cập nhật sản phẩm thành công." });
        }

        [AdminOnly]
        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var ok = await _admin.DeleteProduct(id);
            if (!ok) return NotFound(new { message = "Không tìm thấy sản phẩm." });
            return Ok(new { message = "Xóa sản phẩm thành công." });
        }

        // ---- Orders ----
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _admin.GetAllOrders(status, page, pageSize);
            return Ok(result);
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _admin.UpdateOrderStatus(id, dto.Status);
            if (order == null) return BadRequest(new { message = "Trạng thái không hợp lệ hoặc đơn hàng không tìm thấy." });
            return Ok(order);
        }

        // ---- Users ----
        [AdminOnly]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _admin.GetAllUsers(page, pageSize);
            return Ok(result);
        }

        [AdminOnly]
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
        {
            var ok = await _admin.UpdateUserRole(id, dto.Role);
            if (!ok) return NotFound(new { message = "Không tìm thấy người dùng." });
            return Ok(new { message = "Cập nhật vai trò thành công." });
        }

        // ---- Categories CRUD ----
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var cats = await _admin.GetAllCategoriesFlat();
            return Ok(cats);
        }

        [AdminOnly]
        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] AdminCategoryDto dto)
        {
            try
            {
                var cat = await _admin.CreateCategory(dto);
                return Ok(new { message = "Tạo danh mục thành công.", id = cat.Id });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [AdminOnly]
        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] AdminCategoryDto dto)
        {
            var cat = await _admin.UpdateCategory(id, dto);
            if (cat == null) return NotFound(new { message = "Không tìm thấy danh mục." });
            return Ok(new { message = "Cập nhật danh mục thành công." });
        }

        [AdminOnly]
        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var ok = await _admin.DeleteCategory(id);
            if (!ok) return NotFound(new { message = "Không tìm thấy danh mục." });
            return Ok(new { message = "Xóa danh mục thành công." });
        }
    }
}
