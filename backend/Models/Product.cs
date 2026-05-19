using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MShop.API.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(300)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        public string Slug { get; set; } = string.Empty;

        [MaxLength(5000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OriginalPrice { get; set; }

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        // JSON array of additional image URLs
        [MaxLength(2000)]
        public string? Images { get; set; }

        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category Category { get; set; } = null!;

        [MaxLength(200)]
        public string? Brand { get; set; }

        [MaxLength(200)]
        public string? Series { get; set; }

        [MaxLength(100)]
        public string? Grade { get; set; }

        [MaxLength(50)]
        public string? Scale { get; set; }

        [MaxLength(100)]
        public string? Condition { get; set; }

        [MaxLength(50)]
        public string StockStatus { get; set; } = "InStock"; // InStock, OutOfStock, PreOrder

        [ConcurrencyCheck]
        public int Quantity { get; set; } = 0;

        public bool IsFeatured { get; set; } = false;
        public bool IsNewArrival { get; set; } = false;
        public bool IsPreorder { get; set; } = false;
        public bool IsSale { get; set; } = false;

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public int ReviewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
