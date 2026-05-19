using Microsoft.EntityFrameworkCore;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class ReviewService
    {
        private readonly AppDbContext _db;

        public ReviewService(AppDbContext db) => _db = db;

        public async Task<List<ReviewDto>> GetProductReviews(int productId)
        {
            return await _db.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Title = r.Title,
                    Content = r.Content,
                    UserName = r.User.FullName,
                    UserId = r.UserId,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ReviewDto> CreateReview(CreateReviewDto dto, int userId)
        {
            var product = await _db.Products.FindAsync(dto.ProductId)
                ?? throw new Exception("Sản phẩm không tồn tại.");

            var user = await _db.Users.FindAsync(userId)
                ?? throw new Exception("Người dùng không tồn tại.");

            var review = new Review
            {
                ProductId = dto.ProductId,
                UserId = userId,
                Rating = dto.Rating,
                Title = dto.Title,
                Content = dto.Content
            };

            _db.Reviews.Add(review);

            // Update product rating
            var allRatings = await _db.Reviews.Where(r => r.ProductId == dto.ProductId).Select(r => r.Rating).ToListAsync();
            allRatings.Add(dto.Rating);
            product.Rating = (decimal)allRatings.Average();
            product.ReviewCount = allRatings.Count;

            await _db.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                Rating = review.Rating,
                Title = review.Title,
                Content = review.Content,
                UserName = user.FullName,
                UserId = user.Id,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<bool> DeleteReview(int reviewId, int currentUserId, string role)
        {
            var review = await _db.Reviews.FindAsync(reviewId);
            if (review == null) return false;

            if (review.UserId != currentUserId && role != "Admin") return false;

            int productId = review.ProductId;
            _db.Reviews.Remove(review);

            var remainingRatings = await _db.Reviews
                .Where(r => r.ProductId == productId && r.Id != reviewId)
                .Select(r => r.Rating)
                .ToListAsync();

            var product = await _db.Products.FindAsync(productId);
            if (product != null)
            {
                if (remainingRatings.Any())
                {
                    product.Rating = (decimal)remainingRatings.Average();
                    product.ReviewCount = remainingRatings.Count;
                }
                else
                {
                    product.Rating = 0;
                    product.ReviewCount = 0;
                }
            }

            await _db.SaveChangesAsync();
            return true;
        }
    }
}
