using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MShop.API.Models
{
    public class Coupon
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        [MaxLength(20)]
        public string DiscountType { get; set; } = "Percent"; // Percent or Fixed

        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscount { get; set; }

        public int MaxUses { get; set; } = 100;
        public int UsedCount { get; set; } = 0;

        public DateTime? ExpiresAt { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Wishlist
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!;
    }

    public class Blog
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(300)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Summary { get; set; }

        public string? Content { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public int AuthorId { get; set; }

        [ForeignKey("AuthorId")]
        public User Author { get; set; } = null!;

        public bool IsPublished { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class StoreEvent
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(300)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required, MaxLength(30)]
        public string Type { get; set; } = "Sale"; // Sale, NewArrival, Restock, Event

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Upcoming"; // Upcoming, Active, Ended

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        [MaxLength(50)]
        public string? BadgeText { get; set; }

        [MaxLength(500)]
        public string? LinkUrl { get; set; }

        public bool IsPublished { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ProductQuestion
    {
        [Key]
        public int Id { get; set; }

        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; } = null!;

        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required, MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        public string? Answer { get; set; }

        public int? AnsweredById { get; set; }
        [ForeignKey("AnsweredById")]
        public User? AnsweredBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AnsweredAt { get; set; }
    }
}
