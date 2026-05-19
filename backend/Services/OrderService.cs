using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class OrderService
    {
        private readonly AppDbContext _db;

        public OrderService(AppDbContext db) => _db = db;

        public async Task<OrderResponseDto> CreateOrder(CreateOrderDto dto, int? userId)
        {
            var order = new Order
            {
                UserId = userId,
                OrderCode = "MS" + DateTime.UtcNow.ToString("yyyyMMddHHmmss") + new Random().Next(100, 999),
                FullName = dto.FullName,
                Phone = dto.Phone,
                Address = dto.Address,
                Email = dto.Email,
                PaymentMethod = dto.PaymentMethod,
                Note = dto.Note,
                Status = "Pending"
            };

            decimal total = 0;
            foreach (var item in dto.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId)
                    ?? throw new Exception($"Sản phẩm #{item.ProductId} không tồn tại.");

                if (product.Quantity < item.Quantity)
                    throw new Exception($"Sản phẩm {product.Name} không đủ số lượng trong kho (Còn lại: {product.Quantity}).");

                product.Quantity -= item.Quantity; // Deduct stock

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ProductImage = product.ImageUrl,
                    Price = product.Price,
                    Quantity = item.Quantity
                };

                total += product.Price * item.Quantity;
                order.Items.Add(orderItem);
            }

            order.TotalAmount = total;
            _db.Orders.Add(order);
            
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new Exception("Xin lỗi, sản phẩm bạn chọn vừa có người mua trước nên số lượng trong kho đã hết hoặc không đủ. Vui lòng tải lại trang và thử lại.");
            }

            return MapOrder(order);
        }

        public async Task<OrderResponseDto> ConfirmPayment(int id, int userId)
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
            if (order != null && order.Status == "Pending")
            {
                order.Status = "Confirmed";
                await _db.SaveChangesAsync();
            }
            return order == null ? throw new Exception("Không tìm thấy đơn hàng.") : MapOrder(order);
        }

        public async Task<List<OrderResponseDto>> GetUserOrders(int userId)
        {
            var orders = await _db.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapOrder).ToList();
        }

        public async Task<OrderResponseDto?> GetOrder(int id, int userId)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            return order == null ? null : MapOrder(order);
        }

        public async Task<OrderResponseDto> CancelOrder(int id, int userId, string reason)
        {
            var order = await _db.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId)
                ?? throw new Exception("Không tìm thấy đơn hàng.");

            if (order.Status != "Pending")
                throw new Exception("Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xác nhận'.");

            order.Status = "Cancelled";
            order.CancellationReason = reason;

            // Restore stock
            foreach (var item in order.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.Quantity += item.Quantity;
                }
            }

            await _db.SaveChangesAsync();
            return MapOrder(order);
        }

        private static OrderResponseDto MapOrder(Order order) => new()
        {
            Id = order.Id,
            OrderCode = order.OrderCode,
            FullName = order.FullName,
            Phone = order.Phone,
            Address = order.Address,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            Note = order.Note,
            CancellationReason = order.CancellationReason,
            CreatedAt = order.CreatedAt,
            Items = order.Items.Select(i => new OrderItemResponseDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                ProductImage = i.ProductImage,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList()
        };
    }
}
