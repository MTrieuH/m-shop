using Microsoft.EntityFrameworkCore;
using MShop.API.Models;

namespace MShop.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Coupon> Coupons => Set<Coupon>();
        public DbSet<Wishlist> Wishlists => Set<Wishlist>();
        public DbSet<Blog> Blogs => Set<Blog>();
        public DbSet<StoreEvent> StoreEvents => Set<StoreEvent>();
        public DbSet<ProductQuestion> ProductQuestions => Set<ProductQuestion>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Category self-referencing
            modelBuilder.Entity<Category>()
                .HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Slug)
                .IsUnique();

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrderCode)
                .IsUnique();

            modelBuilder.Entity<Coupon>()
                .HasIndex(c => c.Code)
                .IsUnique();

            modelBuilder.Entity<Blog>()
                .HasIndex(b => b.Slug)
                .IsUnique();

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // ========== CATEGORIES ==========
            modelBuilder.Entity<Category>().HasData(
                // Top-level
                new Category { Id = 1, Name = "Gundam", Slug = "gundam", Description = "Mô hình Gundam các loại", SortOrder = 1, ImageUrl = "/images/categories/gundam.jpg" },
                new Category { Id = 2, Name = "Model Kits", Slug = "model-kits", Description = "Mô hình lắp ráp khác", SortOrder = 2, ImageUrl = "/images/categories/model-kits.jpg" },
                new Category { Id = 3, Name = "Figures", Slug = "figures", Description = "Mô hình tĩnh & figure", SortOrder = 3, ImageUrl = "/images/categories/figures.jpg" },
                new Category { Id = 4, Name = "Dụng Cụ & Vật Tư", Slug = "dung-cu-vat-tu", Description = "Dụng cụ và vật tư làm mô hình", SortOrder = 4, ImageUrl = "/images/categories/tools.jpg" },

                // Gundam sub-categories
                new Category { Id = 10, Name = "Perfect Grade (PG)", Slug = "perfect-grade", ParentId = 1, SortOrder = 1, ImageUrl = "/images/categories/pg.jpg" },
                new Category { Id = 11, Name = "Master Grade (MG)", Slug = "master-grade", ParentId = 1, SortOrder = 2, ImageUrl = "/images/categories/mg.jpg" },
                new Category { Id = 12, Name = "Real Grade (RG)", Slug = "real-grade", ParentId = 1, SortOrder = 3, ImageUrl = "/images/categories/rg.jpg" },
                new Category { Id = 13, Name = "High Grade (HG)", Slug = "high-grade", ParentId = 1, SortOrder = 4, ImageUrl = "/images/categories/hg.jpg" },
                new Category { Id = 14, Name = "SD Gundam", Slug = "sd-gundam", ParentId = 1, SortOrder = 5, ImageUrl = "/images/categories/sd.jpg" },
                new Category { Id = 15, Name = "Mega Size", Slug = "mega-size", ParentId = 1, SortOrder = 6, ImageUrl = "/images/categories/mega.jpg" },

                // Model Kits sub-categories
                new Category { Id = 20, Name = "30 Minutes Missions", Slug = "30-minutes-missions", ParentId = 2, SortOrder = 1 },
                new Category { Id = 21, Name = "30 Minutes Sisters", Slug = "30-minutes-sisters", ParentId = 2, SortOrder = 2 },
                new Category { Id = 22, Name = "Frame Arms", Slug = "frame-arms", ParentId = 2, SortOrder = 3 },
                new Category { Id = 23, Name = "Evangelion", Slug = "evangelion", ParentId = 2, SortOrder = 4 },
                new Category { Id = 24, Name = "Zoids", Slug = "zoids", ParentId = 2, SortOrder = 5 },

                // Figures sub-categories
                new Category { Id = 30, Name = "Robot Spirits", Slug = "robot-spirits", ParentId = 3, SortOrder = 1 },
                new Category { Id = 31, Name = "Gundam Universe", Slug = "gundam-universe", ParentId = 3, SortOrder = 2 },
                new Category { Id = 32, Name = "Nendoroid", Slug = "nendoroid", ParentId = 3, SortOrder = 3 },

                // Tools sub-categories
                new Category { Id = 40, Name = "Kìm cắt", Slug = "kim-cat", ParentId = 4, SortOrder = 1 },
                new Category { Id = 41, Name = "Sơn mô hình", Slug = "son-mo-hinh", ParentId = 4, SortOrder = 2 },
                new Category { Id = 42, Name = "Keo & Chất trám", Slug = "keo-chat-tram", ParentId = 4, SortOrder = 3 },
                new Category { Id = 43, Name = "Đế dựng", Slug = "de-dung", ParentId = 4, SortOrder = 4 }
            );

            // ========== PRODUCTS ==========
            var products = new List<Product>();
            int pid = 1;

            // --- PG ---
            products.Add(new Product { Id = pid++, Name = "PG Unleashed RX-78-2 Gundam", Slug = "pg-unleashed-rx-78-2-gundam", Description = "Phiên bản PG Unleashed hoàn toàn mới của RX-78-2 Gundam, với độ chi tiết và khớp nối chưa từng có. Bộ kit bao gồm led unit tích hợp và khung nội thất cực kỳ chi tiết.", Price = 5500000, ImageUrl = "/images/products/pg-unleashed-rx782.jpg", CategoryId = 10, Brand = "Bandai", Series = "Mobile Suit Gundam", Grade = "PG", Scale = "1/60", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 15, IsFeatured = true, Rating = 4.90m, ReviewCount = 45 });
            products.Add(new Product { Id = pid++, Name = "PG RX-0 Unicorn Gundam", Slug = "pg-rx-0-unicorn-gundam", Description = "PG Unicorn Gundam với cơ chế biến hình Destroy Mode hoàn chỉnh. LED Unit bán riêng.", Price = 4800000, OriginalPrice = 5200000, ImageUrl = "/images/products/pg-unicorn.jpg", CategoryId = 10, Brand = "Bandai", Series = "Gundam Unicorn", Grade = "PG", Scale = "1/60", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 8, IsFeatured = true, IsSale = true, Rating = 4.80m, ReviewCount = 38 });
            products.Add(new Product { Id = pid++, Name = "PG Strike Freedom Gundam", Slug = "pg-strike-freedom-gundam", Description = "PG Strike Freedom Gundam với hiệu ứng cánh DRAGOON tuyệt đẹp.", Price = 5800000, ImageUrl = "/images/products/pg-strike-freedom.jpg", CategoryId = 10, Brand = "Bandai", Series = "Gundam SEED Destiny", Grade = "PG", Scale = "1/60", Condition = "Mô hình lắp ráp", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, Rating = 4.70m, ReviewCount = 12 });

            // --- MG ---
            products.Add(new Product { Id = pid++, Name = "MG ASW-G-08 Gundam Barbatos", Slug = "mg-asw-g-08-gundam-barbatos", Description = "MG Gundam Barbatos từ series Iron-Blooded Orphans. Thiết kế khung nội thất cực chi tiết.", Price = 1400000, ImageUrl = "/images/products/mg-barbatos.jpg", CategoryId = 11, Brand = "Bandai", Series = "Iron-Blooded Orphans", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, IsNewArrival = true, Rating = 4.95m, ReviewCount = 61 });
            products.Add(new Product { Id = pid++, Name = "MG Freedom Gundam Ver.2.0", Slug = "mg-freedom-gundam-ver-2", Description = "MG Freedom Gundam phiên bản 2.0 với cải tiến toàn diện về khớp nối và chi tiết.", Price = 1400000, ImageUrl = "/images/products/mg-freedom-v2.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam SEED", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 25, IsFeatured = true, Rating = 4.85m, ReviewCount = 26 });
            products.Add(new Product { Id = pid++, Name = "MG Wing Gundam Zero EW Ver.Ka", Slug = "mg-wing-zero-ew-ver-ka", Description = "MG Wing Gundam Zero EW phiên bản Ver.Ka, thiết kế bởi Hajime Katoki. Đôi cánh thiên thần ấn tượng.", Price = 1700000, ImageUrl = "/images/products/mg-wing-zero.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam Wing", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 20, IsFeatured = true, Rating = 4.80m, ReviewCount = 28 });
            products.Add(new Product { Id = pid++, Name = "MG RX-78-2 Gundam Ver.3.0", Slug = "mg-rx-78-2-ver-3", Description = "Phiên bản thứ 3 của MG RX-78-2 với công nghệ khớp nối mới nhất.", Price = 1450000, ImageUrl = "/images/products/mg-rx782-v3.jpg", CategoryId = 11, Brand = "Bandai", Series = "Mobile Suit Gundam", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 30, Rating = 4.70m, ReviewCount = 18 });
            products.Add(new Product { Id = pid++, Name = "MG Sazabi Ver.Ka", Slug = "mg-sazabi-ver-ka", Description = "MG Sazabi Ver.Ka - một trong những bộ MG lớn nhất và chi tiết nhất từ trước đến nay.", Price = 2200000, ImageUrl = "/images/products/mg-sazabi.jpg", CategoryId = 11, Brand = "Bandai", Series = "Char's Counterattack", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 12, IsFeatured = true, Rating = 4.95m, ReviewCount = 55 });
            products.Add(new Product { Id = pid++, Name = "MG Nu Gundam Ver.Ka", Slug = "mg-nu-gundam-ver-ka", Description = "MG Nu Gundam Ver.Ka với Fin Funnel có thể tháo rời và đế dựng chuyên dụng.", Price = 2000000, ImageUrl = "/images/products/mg-nu-gundam.jpg", CategoryId = 11, Brand = "Bandai", Series = "Char's Counterattack", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 10, IsFeatured = true, Rating = 4.90m, ReviewCount = 42 });
            products.Add(new Product { Id = pid++, Name = "MG Deathscythe Hell EW Ver.Ka", Slug = "mg-deathscythe-hell-ew", Description = "MG Deathscythe Hell phiên bản Ver.Ka từ Gundam Wing Endless Waltz.", Price = 1300000, ImageUrl = "/images/products/mg-deathscythe.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam Wing", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 18, IsNewArrival = true, Rating = 4.75m, ReviewCount = 25 });

            // --- RG ---
            products.Add(new Product { Id = pid++, Name = "RG Hi-Nu Gundam", Slug = "rg-hi-nu-gundam", Description = "RG Hi-Nu Gundam với Fin Funnel cực kỳ chi tiết ở tỉ lệ 1/144.", Price = 950000, ImageUrl = "/images/products/rg-hi-nu.jpg", CategoryId = 12, Brand = "Bandai", Series = "Char's Counterattack", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 22, IsFeatured = true, Rating = 4.85m, ReviewCount = 34 });
            products.Add(new Product { Id = pid++, Name = "RG Evangelion Unit-01", Slug = "rg-evangelion-unit-01", Description = "RG Evangelion Unit-01 với chi tiết đáng kinh ngạc ở tỉ lệ nhỏ.", Price = 850000, ImageUrl = "/images/products/rg-eva-01.jpg", CategoryId = 12, Brand = "Bandai", Series = "Evangelion", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 15, Rating = 4.80m, ReviewCount = 20 });
            products.Add(new Product { Id = pid++, Name = "RG Wing Gundam Zero EW", Slug = "rg-wing-zero-ew", Description = "RG Wing Gundam Zero phiên bản Endless Waltz với cánh có thể mở rộng.", Price = 750000, ImageUrl = "/images/products/rg-wing-zero.jpg", CategoryId = 12, Brand = "Bandai", Series = "Gundam Wing", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 28, Rating = 4.75m, ReviewCount = 22 });
            products.Add(new Product { Id = pid++, Name = "RG Force Impulse Gundam Spec II", Slug = "rg-force-impulse-spec-ii", Description = "RG Force Impulse Gundam Spec II từ SEED Freedom.", Price = 800000, ImageUrl = "/images/products/rg-force-impulse.jpg", CategoryId = 12, Brand = "Bandai", Series = "Gundam SEED", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 20, IsNewArrival = true, Rating = 4.70m, ReviewCount = 8 });
            products.Add(new Product { Id = pid++, Name = "RG God Gundam", Slug = "rg-god-gundam", Description = "RG God Gundam (Burning Gundam) từ G Gundam.", Price = 780000, ImageUrl = "/images/products/rg-god-gundam.jpg", CategoryId = 12, Brand = "Bandai", Series = "G Gundam", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, Rating = 4.60m, ReviewCount = 5 });

            // --- HG ---
            products.Add(new Product { Id = pid++, Name = "HG Gundam Aerial", Slug = "hg-gundam-aerial", Description = "HG Gundam Aerial từ The Witch from Mercury. Bộ kit với thiết kế hiện đại.", Price = 450000, ImageUrl = "/images/products/hg-aerial.jpg", CategoryId = 13, Brand = "Bandai", Series = "The Witch from Mercury", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 40, IsFeatured = true, Rating = 4.65m, ReviewCount = 30 });
            products.Add(new Product { Id = pid++, Name = "HG Schwarzette", Slug = "hg-schwarzette", Description = "HG Schwarzette với màu đen huyền bí từ The Witch from Mercury.", Price = 480000, ImageUrl = "/images/products/hg-schwarzette.jpg", CategoryId = 13, Brand = "Bandai", Series = "The Witch from Mercury", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 35, Rating = 4.55m, ReviewCount = 15 });
            products.Add(new Product { Id = pid++, Name = "HG Mighty Strike Freedom Gundam", Slug = "hg-mighty-strike-freedom", Description = "HG Mighty Strike Freedom Gundam từ phim SEED Freedom.", Price = 520000, ImageUrl = "/images/products/hg-mighty-sf.jpg", CategoryId = 13, Brand = "Bandai", Series = "Gundam SEED", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 30, IsNewArrival = true, Rating = 4.60m, ReviewCount = 12 });
            products.Add(new Product { Id = pid++, Name = "HG Gundam Calibarn", Slug = "hg-gundam-calibarn", Description = "HG Gundam Calibarn - Gundam cuối cùng của Suletta.", Price = 430000, ImageUrl = "/images/products/hg-calibarn.jpg", CategoryId = 13, Brand = "Bandai", Series = "The Witch from Mercury", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 25, Rating = 4.70m, ReviewCount = 18 });
            products.Add(new Product { Id = pid++, Name = "HGCE Strike Freedom Gundam", Slug = "hgce-strike-freedom", Description = "HG Cosmic Era Strike Freedom Gundam với áo giáp vàng kim.", Price = 500000, OriginalPrice = 580000, ImageUrl = "/images/products/hgce-strike-freedom.jpg", CategoryId = 13, Brand = "Bandai", Series = "Gundam SEED Destiny", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 15, IsSale = true, Rating = 4.50m, ReviewCount = 20 });

            // --- SD ---
            products.Add(new Product { Id = pid++, Name = "SD EX-Standard RX-78-2 Gundam", Slug = "sd-ex-rx-78-2", Description = "SD EX-Standard phiên bản RX-78-2 Gundam nhỏ gọn và dễ ráp.", Price = 200000, ImageUrl = "/images/products/sd-rx782.jpg", CategoryId = 14, Brand = "Bandai", Series = "Mobile Suit Gundam", Grade = "SD", Scale = "SD", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 50, Rating = 4.30m, ReviewCount = 15 });
            products.Add(new Product { Id = pid++, Name = "SD Gundam World Heroes Wukong Impulse", Slug = "sd-wukong-impulse", Description = "SD Gundam World Heroes Wukong Impulse với chủ đề Tề Thiên Đại Thánh.", Price = 280000, ImageUrl = "/images/products/sd-wukong.jpg", CategoryId = 14, Brand = "Bandai", Series = "SD World Heroes", Grade = "SD", Scale = "SD", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 20, Rating = 4.40m, ReviewCount = 10 });

            // --- 30MM ---
            products.Add(new Product { Id = pid++, Name = "30MM eEXM-17 Alto (White)", Slug = "30mm-alto-white", Description = "30 Minutes Missions Alto phiên bản trắng, có thể tùy biến linh hoạt.", Price = 280000, ImageUrl = "/images/products/30mm-alto.jpg", CategoryId = 20, Brand = "Bandai", Series = "30 Minutes Missions", Grade = "30MM", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 30, Rating = 4.40m, ReviewCount = 12 });

            // --- 30MS ---
            products.Add(new Product { Id = pid++, Name = "30MS Lirinel (Color A)", Slug = "30ms-lirinel-a", Description = "30 Minutes Sisters Lirinel với nhiều option tùy biến.", Price = 380000, ImageUrl = "/images/products/30ms-lirinel.jpg", CategoryId = 21, Brand = "Bandai", Series = "30 Minutes Sisters", Grade = "30MS", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 18, Rating = 4.50m, ReviewCount = 8 });

            // --- Frame Arms ---
            products.Add(new Product { Id = pid++, Name = "Frame Arms Girl Hresvelgr", Slug = "fag-hresvelgr", Description = "Frame Arms Girl Hresvelgr từ Kotobukiya.", Price = 1200000, ImageUrl = "/images/products/fag-hresvelgr.jpg", CategoryId = 22, Brand = "Kotobukiya", Series = "Frame Arms Girl", Grade = "N/A", Scale = "N/A", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 10, Rating = 4.60m, ReviewCount = 14 });

            // --- Figure ---
            products.Add(new Product { Id = pid++, Name = "Robot Spirits RX-78-2 Gundam A.N.I.M.E.", Slug = "rs-rx782-anime", Description = "Robot Spirits RX-78-2 phiên bản A.N.I.M.E. với hiệu ứng đầy đủ.", Price = 1500000, ImageUrl = "/images/products/rs-rx782.jpg", CategoryId = 30, Brand = "Bandai", Series = "Mobile Suit Gundam", Grade = "N/A", Scale = "N/A", Condition = "Figure hoàn thiện", StockStatus = "InStock", Quantity = 8, Rating = 4.75m, ReviewCount = 16 });
            products.Add(new Product { Id = pid++, Name = "Gundam Universe RX-93 Nu Gundam", Slug = "gu-nu-gundam", Description = "Gundam Universe Nu Gundam, figure với giá thành hợp lý.", Price = 680000, ImageUrl = "/images/products/gu-nu-gundam.jpg", CategoryId = 31, Brand = "Bandai", Series = "Char's Counterattack", Grade = "N/A", Scale = "N/A", Condition = "Figure hoàn thiện", StockStatus = "InStock", Quantity = 12, Rating = 4.40m, ReviewCount = 9 });

            // --- Tools ---
            products.Add(new Product { Id = pid++, Name = "Godhand SPN-120 Kìm cắt chuyên dụng", Slug = "godhand-spn120", Description = "Kìm cắt GodHand SPN-120 chuyên dụng cho Gunpla, lưỡi siêu mỏng.", Price = 1800000, ImageUrl = "/images/products/godhand-spn120.jpg", CategoryId = 40, Brand = "GodHand", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Dụng cụ", StockStatus = "InStock", Quantity = 15, IsFeatured = true, Rating = 4.95m, ReviewCount = 52 });
            products.Add(new Product { Id = pid++, Name = "Tamiya Panel Line Accent Color (Black)", Slug = "tamiya-panel-line-black", Description = "Tamiya Panel Line Accent màu đen, dùng để vẽ đường chỉ panel lining.", Price = 120000, ImageUrl = "/images/products/tamiya-panel.jpg", CategoryId = 42, Brand = "Tamiya", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Vật tư", StockStatus = "InStock", Quantity = 50, Rating = 4.80m, ReviewCount = 40 });
            products.Add(new Product { Id = pid++, Name = "Action Base 1 (Clear)", Slug = "action-base-1-clear", Description = "Đế dựng Action Base 1 trong suốt, phù hợp cho HG, MG, RG.", Price = 150000, ImageUrl = "/images/products/action-base-1.jpg", CategoryId = 43, Brand = "Bandai", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Phụ kiện", StockStatus = "InStock", Quantity = 60, Rating = 4.50m, ReviewCount = 25 });
            products.Add(new Product { Id = pid++, Name = "Mr. Color Leveling Thinner 400ml", Slug = "mr-color-thinner-400", Description = "Dung dịch pha sơn Mr. Color Leveling Thinner, giúp sơn mịn hơn.", Price = 250000, ImageUrl = "/images/products/mr-thinner.jpg", CategoryId = 41, Brand = "Mr. Hobby", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Vật tư", StockStatus = "InStock", Quantity = 25, Rating = 4.70m, ReviewCount = 18 });

            // === NEW 19 PRODUCTS ===

            // --- MG (thêm) ---
            products.Add(new Product { Id = pid++, Name = "MG GN-001 Gundam Exia", Slug = "mg-gundam-exia", Description = "MG Gundam Exia từ Gundam 00 với thiết kế GN Blade sắc bén và khớp nối linh hoạt.", Price = 1350000, ImageUrl = "/images/products/mg-exia.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam 00", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 20, Rating = 4.75m, ReviewCount = 22 });
            products.Add(new Product { Id = pid++, Name = "MG Full Armor Gundam Ver.Ka (Thunderbolt)", Slug = "mg-full-armor-gundam-thunderbolt", Description = "MG Full Armor Gundam Thunderbolt Ver.Ka với vũ khí và trang bị nặng đầy đủ.", Price = 2100000, ImageUrl = "/images/products/mg-fa-thunderbolt.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam Thunderbolt", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 10, IsFeatured = true, Rating = 4.88m, ReviewCount = 32 });
            products.Add(new Product { Id = pid++, Name = "MG Destiny Gundam Spec II Ver.Ka", Slug = "mg-destiny-spec-ii-ver-ka", Description = "MG Destiny Gundam Spec II Ver.Ka từ SEED Freedom với Wings of Light.", Price = 2000000, ImageUrl = "/images/products/mg-destiny-spec2.jpg", CategoryId = 11, Brand = "Bandai", Series = "Gundam SEED", Grade = "MG", Scale = "1/100", Condition = "Mô hình lắp ráp", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, IsNewArrival = true, Rating = 4.50m, ReviewCount = 3 });

            // --- RG (thêm) ---
            products.Add(new Product { Id = pid++, Name = "RG Gundam Astray Red Frame", Slug = "rg-astray-red-frame", Description = "RG Gundam Astray Red Frame với katana Gerbera Straight cực chất.", Price = 720000, ImageUrl = "/images/products/rg-astray-red.jpg", CategoryId = 12, Brand = "Bandai", Series = "Gundam SEED", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 18, Rating = 4.72m, ReviewCount = 19 });
            products.Add(new Product { Id = pid++, Name = "RG Zeong", Slug = "rg-zeong", Description = "RG Zeong - Mobile Suit khổng lồ của Zeon với hiệu ứng mega particle cannon.", Price = 1100000, ImageUrl = "/images/products/rg-zeong.jpg", CategoryId = 12, Brand = "Bandai", Series = "Mobile Suit Gundam", Grade = "RG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 12, IsNewArrival = true, Rating = 4.82m, ReviewCount = 14 });

            // --- HG (thêm) ---
            products.Add(new Product { Id = pid++, Name = "HG Penelope", Slug = "hg-penelope", Description = "HG Penelope từ Hathaway's Flash, bộ kit HG kích thước lớn với Fixed Flight Unit.", Price = 1200000, ImageUrl = "/images/products/hg-penelope.jpg", CategoryId = 13, Brand = "Bandai", Series = "Hathaway's Flash", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 8, Rating = 4.68m, ReviewCount = 11 });
            products.Add(new Product { Id = pid++, Name = "HG Gundam Lfrith", Slug = "hg-gundam-lfrith", Description = "HG Gundam Lfrith - tiền thân của Aerial từ The Witch from Mercury Prologue.", Price = 420000, ImageUrl = "/images/products/hg-lfrith.jpg", CategoryId = 13, Brand = "Bandai", Series = "The Witch from Mercury", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "OutOfStock", Quantity = 0, Rating = 4.58m, ReviewCount = 16 });
            products.Add(new Product { Id = pid++, Name = "HGBF Try Burning Gundam", Slug = "hgbf-try-burning-gundam", Description = "HGBF Try Burning Gundam từ Build Fighters Try với hiệu ứng lửa.", Price = 380000, OriginalPrice = 450000, ImageUrl = "/images/products/hgbf-try-burning.jpg", CategoryId = 13, Brand = "Bandai", Series = "Build Fighters", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 22, IsSale = true, Rating = 4.52m, ReviewCount = 14 });
            products.Add(new Product { Id = pid++, Name = "HG Gundam Pharact", Slug = "hg-gundam-pharact", Description = "HG Gundam Pharact với GUND-BIT và thiết kế Peil Technologies.", Price = 460000, ImageUrl = "/images/products/hg-pharact.jpg", CategoryId = 13, Brand = "Bandai", Series = "The Witch from Mercury", Grade = "HG", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 14, Rating = 4.55m, ReviewCount = 9 });

            // --- PG (thêm) ---
            products.Add(new Product { Id = pid++, Name = "PG Banshee Norn", Slug = "pg-banshee-norn", Description = "PG Unicorn Gundam 02 Banshee Norn với cơ chế biến hình Destroy Mode và Armed Armor.", Price = 5200000, ImageUrl = "/images/products/pg-banshee-norn.jpg", CategoryId = 10, Brand = "Bandai", Series = "Gundam Unicorn", Grade = "PG", Scale = "1/60", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 5, Rating = 4.85m, ReviewCount = 28 });

            // --- Mega Size ---
            products.Add(new Product { Id = pid++, Name = "Mega Size Unicorn Gundam (Destroy Mode)", Slug = "mega-size-unicorn-destroy", Description = "Mega Size 1/48 Unicorn Gundam Destroy Mode - kích thước khổng lồ 48cm.", Price = 2500000, ImageUrl = "/images/products/mega-unicorn.jpg", CategoryId = 15, Brand = "Bandai", Series = "Gundam Unicorn", Grade = "Mega Size", Scale = "1/48", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 6, Rating = 4.45m, ReviewCount = 7 });

            // --- SD (thêm) ---
            products.Add(new Product { Id = pid++, Name = "MGSD Freedom Gundam", Slug = "mgsd-freedom-gundam", Description = "MGSD Freedom Gundam - kết hợp tỉ lệ SD với chi tiết Master Grade.", Price = 750000, ImageUrl = "/images/products/mgsd-freedom.jpg", CategoryId = 14, Brand = "Bandai", Series = "Gundam SEED", Grade = "SD", Scale = "SD", Condition = "Mô hình lắp ráp", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, IsNewArrival = true, Rating = 4.65m, ReviewCount = 4 });

            // --- 30MM (thêm) ---
            products.Add(new Product { Id = pid++, Name = "30MM bEXM-15 Portanova (Dark Gray)", Slug = "30mm-portanova-dark-gray", Description = "30MM Portanova phiên bản xám đậm, đối thủ của Alto, tùy biến đa dạng.", Price = 300000, ImageUrl = "/images/products/30mm-portanova.jpg", CategoryId = 20, Brand = "Bandai", Series = "30 Minutes Missions", Grade = "30MM", Scale = "1/144", Condition = "Mô hình lắp ráp", StockStatus = "InStock", Quantity = 25, Rating = 4.35m, ReviewCount = 10 });

            // --- Figures (thêm) ---
            products.Add(new Product { Id = pid++, Name = "Robot Spirits MSN-04 Sazabi A.N.I.M.E.", Slug = "rs-sazabi-anime", Description = "Robot Spirits Sazabi phiên bản A.N.I.M.E. với full hiệu ứng funnel.", Price = 2200000, ImageUrl = "/images/products/rs-sazabi.jpg", CategoryId = 30, Brand = "Bandai", Series = "Char's Counterattack", Grade = "N/A", Scale = "N/A", Condition = "Figure hoàn thiện", StockStatus = "InStock", Quantity = 7, Rating = 4.90m, ReviewCount = 21 });
            products.Add(new Product { Id = pid++, Name = "Nendoroid Lfrith (Suletta Mercury)", Slug = "nendoroid-suletta", Description = "Nendoroid Suletta Mercury cưỡi Gundam Aerial mini cực dễ thương.", Price = 950000, ImageUrl = "/images/products/nendo-suletta.jpg", CategoryId = 32, Brand = "Good Smile Company", Series = "The Witch from Mercury", Grade = "N/A", Scale = "N/A", Condition = "Figure hoàn thiện", StockStatus = "PreOrder", Quantity = 0, IsPreorder = true, Rating = 4.70m, ReviewCount = 6 });

            // --- Tools (thêm) ---
            products.Add(new Product { Id = pid++, Name = "Tamiya Kìm cắt Side Cutter", Slug = "tamiya-side-cutter", Description = "Kìm cắt Tamiya Sharp Pointed Side Cutter, chất lượng Nhật Bản, phù hợp cho mọi loại runner.", Price = 650000, ImageUrl = "/images/products/tamiya-cutter.jpg", CategoryId = 40, Brand = "Tamiya", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Dụng cụ", StockStatus = "InStock", Quantity = 30, Rating = 4.78m, ReviewCount = 24 });
            products.Add(new Product { Id = pid++, Name = "Mr. Surfacer 1000 Spray", Slug = "mr-surfacer-1000-spray", Description = "Sơn lót Mr. Surfacer 1000 dạng xịt, lấp đầy vết xước nhỏ và tạo bề mặt bám sơn tốt.", Price = 180000, ImageUrl = "/images/products/mr-surfacer.jpg", CategoryId = 41, Brand = "Mr. Hobby", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Vật tư", StockStatus = "InStock", Quantity = 35, Rating = 4.65m, ReviewCount = 15 });
            products.Add(new Product { Id = pid++, Name = "Gundam Marker Set (6 màu cơ bản)", Slug = "gundam-marker-set-basic", Description = "Bộ bút Gundam Marker 6 màu cơ bản: đen, xám, nâu, đỏ, vàng, trắng. Hoàn hảo cho panel lining và touch-up.", Price = 280000, OriginalPrice = 350000, ImageUrl = "/images/products/gundam-markers.jpg", CategoryId = 41, Brand = "Bandai", Series = "N/A", Grade = "N/A", Scale = "N/A", Condition = "Vật tư", StockStatus = "InStock", Quantity = 40, IsSale = true, Rating = 4.55m, ReviewCount = 30 });

            // Set CreatedAt for all
            foreach (var p in products)
            {
                p.CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddDays(p.Id);
            }

            modelBuilder.Entity<Product>().HasData(products);

            // ========== Admin User (password: Admin@123) ==========
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@mshop.vn",
                    PasswordHash = BCryptHash("Admin@123"),
                    FullName = "M-Shop Admin",
                    Phone = "0901234567",
                    Role = "Admin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    Email = "kho@mshop.vn",
                    PasswordHash = BCryptHash("Kho@123"),
                    FullName = "M-Shop Thủ Kho",
                    Phone = "0907654321",
                    Role = "Warehouse",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ========== Store Events ==========
            modelBuilder.Entity<StoreEvent>().HasData(
                // Sale Events
                new StoreEvent { Id = 1, Title = "Flash Sale Mùa Hè 2026", Description = "Giảm giá lên đến 30% cho toàn bộ HG và RG. Cơ hội tuyệt vời để sở hữu những bộ kit yêu thích!", Type = "Sale", Status = "Active", StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), BadgeText = "HOT", LinkUrl = "/san-pham?sort=price-asc", IsPublished = true, CreatedAt = new DateTime(2026, 3, 25, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 2, Title = "Gunpla Anniversary Sale", Description = "Kỷ niệm 1 năm M-Shop — Giảm 20% toàn bộ Master Grade khi nhập mã MSHOP1Y.", Type = "Sale", Status = "Upcoming", StartDate = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc), BadgeText = "SẮP TỚI", IsPublished = true, CreatedAt = new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 3, Title = "Clearance Sale Q1/2026", Description = "Thanh lý cuối quý — Giảm 40% các sản phẩm tồn kho, số lượng có hạn!", Type = "Sale", Status = "Ended", StartDate = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc), IsPublished = true, CreatedAt = new DateTime(2026, 2, 25, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 4, Title = "Tết Nguyên Đán Sale", Description = "Chương trình ưu đãi đặc biệt dịp Tết — Mua 2 tặng phụ kiện Action Base.", Type = "Sale", Status = "Ended", StartDate = new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc), IsPublished = true, CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc) },
                // Restock / New Arrival Events
                new StoreEvent { Id = 5, Title = "MG Gundam Barbatos — Restock", Description = "Lô hàng MG Barbatos đã xác nhận từ nhà phân phối. Dự kiến về kho trong tuần.", Type = "Restock", Status = "Active", StartDate = new DateTime(2026, 4, 3, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 5, 0, 0, 0, DateTimeKind.Utc), BadgeText = "ĐANG VỀ", IsPublished = true, CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 6, Title = "RG God Gundam — Hàng Mới", Description = "RG God Gundam chính thức phát hành! Số lượng giới hạn, đặt trước ngay.", Type = "NewArrival", Status = "Upcoming", StartDate = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc), BadgeText = "MỚI", LinkUrl = "/san-pham/rg-god-gundam", IsPublished = true, CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 7, Title = "PG Strike Freedom — Restock", Description = "PG Strike Freedom về lại sau thời gian cháy hàng. Đặt trước để đảm bảo.", Type = "Restock", Status = "Upcoming", StartDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 17, 0, 0, 0, DateTimeKind.Utc), IsPublished = true, CreatedAt = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 8, Title = "MGSD Freedom Gundam — Hàng Mới", Description = "MGSD Freedom Gundam — dòng SD với chi tiết MG. Đợt đầu tiên về Việt Nam.", Type = "NewArrival", Status = "Upcoming", StartDate = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 22, 0, 0, 0, DateTimeKind.Utc), BadgeText = "MỚI", LinkUrl = "/san-pham/mgsd-freedom-gundam", IsPublished = true, CreatedAt = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 9, Title = "Lô hàng Tamiya & Mr.Hobby", Description = "Bổ sung đầy đủ sơn, keo, và dụng cụ từ Tamiya và Mr.Hobby.", Type = "Restock", Status = "Active", StartDate = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 4, 0, 0, 0, DateTimeKind.Utc), BadgeText = "ĐÃ VỀ", IsPublished = true, CreatedAt = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc) },
                new StoreEvent { Id = 10, Title = "MG Destiny Spec II Ver.Ka — Pre-order", Description = "Mở đặt trước MG Destiny Spec II Ver.Ka. Giao hàng dự kiến tháng 5.", Type = "NewArrival", Status = "Active", StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc), BadgeText = "PRE-ORDER", LinkUrl = "/san-pham/mg-destiny-spec-ii-ver-ka", IsPublished = true, CreatedAt = new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc) }
            );

            // ========== Sample Reviews ==========
            modelBuilder.Entity<Review>().HasData(
                new Review { Id = 1, ProductId = 1, UserId = 1, Rating = 5, Title = "Tuyệt vời!", Content = "Bộ kit PG Unleashed quá đẹp, chi tiết từng milimet. Rất đáng đồng tiền bát gạo!", CreatedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 2, ProductId = 4, UserId = 1, Rating = 5, Title = "Barbatos quá đỉnh", Content = "MG Barbatos thiết kế khung nội thất tuyệt đẹp, khớp chắc chắn.", CreatedAt = new DateTime(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 3, ProductId = 8, UserId = 1, Rating = 5, Title = "Sazabi - Best MG", Content = "Sazabi Ver.Ka là bộ MG hay nhất mà tôi từng ráp. To, đẹp, chi tiết.", CreatedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc) },
                new Review { Id = 4, ProductId = 17, UserId = 1, Rating = 5, Title = "Aerial rất dễ ráp", Content = "HG Aerial là bộ kit tuyệt vời cho người mới bắt đầu, dễ ráp và đẹp.", CreatedAt = new DateTime(2026, 2, 15, 0, 0, 0, DateTimeKind.Utc) }
            );
        }

        // Simple hash for seed data (in production use proper BCrypt)
        private static string BCryptHash(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password + "MShopSalt2026"));
            return Convert.ToBase64String(bytes);
        }
    }
}
