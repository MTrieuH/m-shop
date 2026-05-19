using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class CouponService
    {
        private readonly AppDbContext _db;
        public CouponService(AppDbContext db) => _db = db;

        public async Task<(bool valid, string message, decimal discount)> ValidateCoupon(string code, decimal orderTotal)
        {
            var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code);
            if (coupon == null) return (false, "Mã giảm giá không tồn tại.", 0);
            if (!coupon.IsActive) return (false, "Mã giảm giá đã hết hiệu lực.", 0);
            if (coupon.ExpiresAt.HasValue && coupon.ExpiresAt.Value < DateTime.UtcNow) return (false, "Mã giảm giá đã hết hạn.", 0);
            if (coupon.UsedCount >= coupon.MaxUses) return (false, "Mã giảm giá đã hết lượt sử dụng.", 0);
            if (orderTotal < coupon.MinOrderAmount) return (false, $"Đơn hàng tối thiểu {coupon.MinOrderAmount:N0}₫.", 0);

            decimal discount;
            if (coupon.DiscountType == "Percent")
            {
                discount = orderTotal * coupon.DiscountValue / 100;
                if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount.Value)
                    discount = coupon.MaxDiscount.Value;
            }
            else
            {
                discount = coupon.DiscountValue;
            }

            return (true, "Áp dụng thành công!", discount);
        }

        public async Task IncrementUsage(string code)
        {
            var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code == code);
            if (coupon != null) { coupon.UsedCount++; await _db.SaveChangesAsync(); }
        }

        public async Task<List<Coupon>> GetAll() => await _db.Coupons.OrderByDescending(c => c.CreatedAt).ToListAsync();

        public async Task<Coupon> Create(Coupon coupon) { _db.Coupons.Add(coupon); await _db.SaveChangesAsync(); return coupon; }

        public async Task<bool> Delete(int id) { var c = await _db.Coupons.FindAsync(id); if (c == null) return false; _db.Coupons.Remove(c); await _db.SaveChangesAsync(); return true; }
    }
}
