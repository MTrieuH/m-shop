using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MShop.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Categories_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DiscountType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DiscountValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinOrderAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxDiscount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaxUses = table.Column<int>(type: "int", nullable: false),
                    UsedCount = table.Column<int>(type: "int", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StoreEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BadgeText = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LinkUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OriginalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Images = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Series = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Grade = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Scale = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Condition = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StockStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    IsNewArrival = table.Column<bool>(type: "bit", nullable: false),
                    IsPreorder = table.Column<bool>(type: "bit", nullable: false),
                    IsSale = table.Column<bool>(type: "bit", nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(3,2)", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AuthorId = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blogs_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    OrderCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnsweredById = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductQuestions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductQuestions_Users_AnsweredById",
                        column: x => x.AnsweredById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductQuestions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Wishlists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Wishlists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Wishlists_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Wishlists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    ProductImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "ImageUrl", "IsActive", "Name", "ParentId", "Slug", "SortOrder" },
                values: new object[,]
                {
                    { 1, "Mô hình Gundam các loại", "/images/categories/gundam.jpg", true, "Gundam", null, "gundam", 1 },
                    { 2, "Mô hình lắp ráp khác", "/images/categories/model-kits.jpg", true, "Model Kits", null, "model-kits", 2 },
                    { 3, "Mô hình tĩnh & figure", "/images/categories/figures.jpg", true, "Figures", null, "figures", 3 },
                    { 4, "Dụng cụ và vật tư làm mô hình", "/images/categories/tools.jpg", true, "Dụng Cụ & Vật Tư", null, "dung-cu-vat-tu", 4 }
                });

            migrationBuilder.InsertData(
                table: "StoreEvents",
                columns: new[] { "Id", "BadgeText", "CreatedAt", "Description", "EndDate", "ImageUrl", "IsPublished", "LinkUrl", "StartDate", "Status", "Title", "Type" },
                values: new object[,]
                {
                    { 1, "HOT", new DateTime(2026, 3, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Giảm giá lên đến 30% cho toàn bộ HG và RG. Cơ hội tuyệt vời để sở hữu những bộ kit yêu thích!", new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, true, "/san-pham?sort=price-asc", new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", "Flash Sale Mùa Hè 2026", "Sale" },
                    { 2, "SẮP TỚI", new DateTime(2026, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Kỷ niệm 1 năm M-Shop — Giảm 20% toàn bộ Master Grade khi nhập mã MSHOP1Y.", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Upcoming", "Gunpla Anniversary Sale", "Sale" },
                    { 3, null, new DateTime(2026, 2, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Thanh lý cuối quý — Giảm 40% các sản phẩm tồn kho, số lượng có hạn!", new DateTime(2026, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ended", "Clearance Sale Q1/2026", "Sale" },
                    { 4, null, new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Chương trình ưu đãi đặc biệt dịp Tết — Mua 2 tặng phụ kiện Action Base.", new DateTime(2026, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Ended", "Tết Nguyên Đán Sale", "Sale" },
                    { 5, "ĐANG VỀ", new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Lô hàng MG Barbatos đã xác nhận từ nhà phân phối. Dự kiến về kho trong tuần.", new DateTime(2026, 4, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 4, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Active", "MG Gundam Barbatos — Restock", "Restock" },
                    { 6, "MỚI", new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "RG God Gundam chính thức phát hành! Số lượng giới hạn, đặt trước ngay.", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, true, "/san-pham/rg-god-gundam", new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Upcoming", "RG God Gundam — Hàng Mới", "NewArrival" },
                    { 7, null, new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "PG Strike Freedom về lại sau thời gian cháy hàng. Đặt trước để đảm bảo.", new DateTime(2026, 4, 17, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Upcoming", "PG Strike Freedom — Restock", "Restock" },
                    { 8, "MỚI", new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "MGSD Freedom Gundam — dòng SD với chi tiết MG. Đợt đầu tiên về Việt Nam.", new DateTime(2026, 4, 22, 0, 0, 0, 0, DateTimeKind.Utc), null, true, "/san-pham/mgsd-freedom-gundam", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Upcoming", "MGSD Freedom Gundam — Hàng Mới", "NewArrival" },
                    { 9, "ĐÃ VỀ", new DateTime(2026, 3, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Bổ sung đầy đủ sơn, keo, và dụng cụ từ Tamiya và Mr.Hobby.", new DateTime(2026, 4, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, null, new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Active", "Lô hàng Tamiya & Mr.Hobby", "Restock" },
                    { 10, "PRE-ORDER", new DateTime(2026, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Mở đặt trước MG Destiny Spec II Ver.Ka. Giao hàng dự kiến tháng 5.", new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, true, "/san-pham/mg-destiny-spec-ii-ver-ka", new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Active", "MG Destiny Spec II Ver.Ka — Pre-order", "NewArrival" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "FullName", "PasswordHash", "Phone", "Role" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@mshop.vn", "M-Shop Admin", "u91qrx4hcYo7r/KN3MulKcVtz809JuWswywp6pY2Lcw=", "0901234567", "Admin" },
                    { 2, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "kho@mshop.vn", "M-Shop Thủ Kho", "XaMaRPqbqr8XNFsECJ8rJas9YYaN+TsWOT/EGkfqp7s=", "0907654321", "Warehouse" }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "ImageUrl", "IsActive", "Name", "ParentId", "Slug", "SortOrder" },
                values: new object[,]
                {
                    { 10, null, "/images/categories/pg.jpg", true, "Perfect Grade (PG)", 1, "perfect-grade", 1 },
                    { 11, null, "/images/categories/mg.jpg", true, "Master Grade (MG)", 1, "master-grade", 2 },
                    { 12, null, "/images/categories/rg.jpg", true, "Real Grade (RG)", 1, "real-grade", 3 },
                    { 13, null, "/images/categories/hg.jpg", true, "High Grade (HG)", 1, "high-grade", 4 },
                    { 14, null, "/images/categories/sd.jpg", true, "SD Gundam", 1, "sd-gundam", 5 },
                    { 15, null, "/images/categories/mega.jpg", true, "Mega Size", 1, "mega-size", 6 },
                    { 20, null, null, true, "30 Minutes Missions", 2, "30-minutes-missions", 1 },
                    { 21, null, null, true, "30 Minutes Sisters", 2, "30-minutes-sisters", 2 },
                    { 22, null, null, true, "Frame Arms", 2, "frame-arms", 3 },
                    { 23, null, null, true, "Evangelion", 2, "evangelion", 4 },
                    { 24, null, null, true, "Zoids", 2, "zoids", 5 },
                    { 30, null, null, true, "Robot Spirits", 3, "robot-spirits", 1 },
                    { 31, null, null, true, "Gundam Universe", 3, "gundam-universe", 2 },
                    { 32, null, null, true, "Nendoroid", 3, "nendoroid", 3 },
                    { 40, null, null, true, "Kìm cắt", 4, "kim-cat", 1 },
                    { 41, null, null, true, "Sơn mô hình", 4, "son-mo-hinh", 2 },
                    { 42, null, null, true, "Keo & Chất trám", 4, "keo-chat-tram", 3 },
                    { 43, null, null, true, "Đế dựng", 4, "de-dung", 4 }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "Condition", "CreatedAt", "Description", "Grade", "ImageUrl", "Images", "IsFeatured", "IsNewArrival", "IsPreorder", "IsSale", "Name", "OriginalPrice", "Price", "Quantity", "Rating", "ReviewCount", "Scale", "Series", "Slug", "StockStatus" },
                values: new object[,]
                {
                    { 1, "Bandai", 10, "Mô hình lắp ráp", new DateTime(2026, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Phiên bản PG Unleashed hoàn toàn mới của RX-78-2 Gundam, với độ chi tiết và khớp nối chưa từng có. Bộ kit bao gồm led unit tích hợp và khung nội thất cực kỳ chi tiết.", "PG", "/images/products/pg-unleashed-rx782.jpg", null, true, false, false, false, "PG Unleashed RX-78-2 Gundam", null, 5500000m, 15, 4.90m, 45, "1/60", "Mobile Suit Gundam", "pg-unleashed-rx-78-2-gundam", "InStock" },
                    { 2, "Bandai", 10, "Mô hình lắp ráp", new DateTime(2026, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "PG Unicorn Gundam với cơ chế biến hình Destroy Mode hoàn chỉnh. LED Unit bán riêng.", "PG", "/images/products/pg-unicorn.jpg", null, true, false, false, true, "PG RX-0 Unicorn Gundam", 5200000m, 4800000m, 8, 4.80m, 38, "1/60", "Gundam Unicorn", "pg-rx-0-unicorn-gundam", "InStock" },
                    { 3, "Bandai", 10, "Mô hình lắp ráp", new DateTime(2026, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "PG Strike Freedom Gundam với hiệu ứng cánh DRAGOON tuyệt đẹp.", "PG", "/images/products/pg-strike-freedom.jpg", null, false, false, true, false, "PG Strike Freedom Gundam", null, 5800000m, 0, 4.70m, 12, "1/60", "Gundam SEED Destiny", "pg-strike-freedom-gundam", "PreOrder" },
                    { 4, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "MG Gundam Barbatos từ series Iron-Blooded Orphans. Thiết kế khung nội thất cực chi tiết.", "MG", "/images/products/mg-barbatos.jpg", null, false, true, true, false, "MG ASW-G-08 Gundam Barbatos", null, 1400000m, 0, 4.95m, 61, "1/100", "Iron-Blooded Orphans", "mg-asw-g-08-gundam-barbatos", "PreOrder" },
                    { 5, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), "MG Freedom Gundam phiên bản 2.0 với cải tiến toàn diện về khớp nối và chi tiết.", "MG", "/images/products/mg-freedom-v2.jpg", null, true, false, false, false, "MG Freedom Gundam Ver.2.0", null, 1400000m, 25, 4.85m, 26, "1/100", "Gundam SEED", "mg-freedom-gundam-ver-2", "InStock" },
                    { 6, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), "MG Wing Gundam Zero EW phiên bản Ver.Ka, thiết kế bởi Hajime Katoki. Đôi cánh thiên thần ấn tượng.", "MG", "/images/products/mg-wing-zero.jpg", null, true, false, false, false, "MG Wing Gundam Zero EW Ver.Ka", null, 1700000m, 20, 4.80m, 28, "1/100", "Gundam Wing", "mg-wing-zero-ew-ver-ka", "InStock" },
                    { 7, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Phiên bản thứ 3 của MG RX-78-2 với công nghệ khớp nối mới nhất.", "MG", "/images/products/mg-rx782-v3.jpg", null, false, false, false, false, "MG RX-78-2 Gundam Ver.3.0", null, 1450000m, 30, 4.70m, 18, "1/100", "Mobile Suit Gundam", "mg-rx-78-2-ver-3", "InStock" },
                    { 8, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 9, 0, 0, 0, 0, DateTimeKind.Utc), "MG Sazabi Ver.Ka - một trong những bộ MG lớn nhất và chi tiết nhất từ trước đến nay.", "MG", "/images/products/mg-sazabi.jpg", null, true, false, false, false, "MG Sazabi Ver.Ka", null, 2200000m, 12, 4.95m, 55, "1/100", "Char's Counterattack", "mg-sazabi-ver-ka", "InStock" },
                    { 9, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "MG Nu Gundam Ver.Ka với Fin Funnel có thể tháo rời và đế dựng chuyên dụng.", "MG", "/images/products/mg-nu-gundam.jpg", null, true, false, false, false, "MG Nu Gundam Ver.Ka", null, 2000000m, 10, 4.90m, 42, "1/100", "Char's Counterattack", "mg-nu-gundam-ver-ka", "InStock" },
                    { 10, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 1, 11, 0, 0, 0, 0, DateTimeKind.Utc), "MG Deathscythe Hell phiên bản Ver.Ka từ Gundam Wing Endless Waltz.", "MG", "/images/products/mg-deathscythe.jpg", null, false, true, false, false, "MG Deathscythe Hell EW Ver.Ka", null, 1300000m, 18, 4.75m, 25, "1/100", "Gundam Wing", "mg-deathscythe-hell-ew", "InStock" },
                    { 11, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Utc), "RG Hi-Nu Gundam với Fin Funnel cực kỳ chi tiết ở tỉ lệ 1/144.", "RG", "/images/products/rg-hi-nu.jpg", null, true, false, false, false, "RG Hi-Nu Gundam", null, 950000m, 22, 4.85m, 34, "1/144", "Char's Counterattack", "rg-hi-nu-gundam", "InStock" },
                    { 12, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 1, 13, 0, 0, 0, 0, DateTimeKind.Utc), "RG Evangelion Unit-01 với chi tiết đáng kinh ngạc ở tỉ lệ nhỏ.", "RG", "/images/products/rg-eva-01.jpg", null, false, false, false, false, "RG Evangelion Unit-01", null, 850000m, 15, 4.80m, 20, "1/144", "Evangelion", "rg-evangelion-unit-01", "InStock" },
                    { 13, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 1, 14, 0, 0, 0, 0, DateTimeKind.Utc), "RG Wing Gundam Zero phiên bản Endless Waltz với cánh có thể mở rộng.", "RG", "/images/products/rg-wing-zero.jpg", null, false, false, false, false, "RG Wing Gundam Zero EW", null, 750000m, 28, 4.75m, 22, "1/144", "Gundam Wing", "rg-wing-zero-ew", "InStock" },
                    { 14, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "RG Force Impulse Gundam Spec II từ SEED Freedom.", "RG", "/images/products/rg-force-impulse.jpg", null, false, true, false, false, "RG Force Impulse Gundam Spec II", null, 800000m, 20, 4.70m, 8, "1/144", "Gundam SEED", "rg-force-impulse-spec-ii", "InStock" },
                    { 15, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 1, 16, 0, 0, 0, 0, DateTimeKind.Utc), "RG God Gundam (Burning Gundam) từ G Gundam.", "RG", "/images/products/rg-god-gundam.jpg", null, false, false, true, false, "RG God Gundam", null, 780000m, 0, 4.60m, 5, "1/144", "G Gundam", "rg-god-gundam", "PreOrder" },
                    { 16, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 1, 17, 0, 0, 0, 0, DateTimeKind.Utc), "HG Gundam Aerial từ The Witch from Mercury. Bộ kit với thiết kế hiện đại.", "HG", "/images/products/hg-aerial.jpg", null, true, false, false, false, "HG Gundam Aerial", null, 450000m, 40, 4.65m, 30, "1/144", "The Witch from Mercury", "hg-gundam-aerial", "InStock" },
                    { 17, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 1, 18, 0, 0, 0, 0, DateTimeKind.Utc), "HG Schwarzette với màu đen huyền bí từ The Witch from Mercury.", "HG", "/images/products/hg-schwarzette.jpg", null, false, false, false, false, "HG Schwarzette", null, 480000m, 35, 4.55m, 15, "1/144", "The Witch from Mercury", "hg-schwarzette", "InStock" },
                    { 18, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 1, 19, 0, 0, 0, 0, DateTimeKind.Utc), "HG Mighty Strike Freedom Gundam từ phim SEED Freedom.", "HG", "/images/products/hg-mighty-sf.jpg", null, false, true, false, false, "HG Mighty Strike Freedom Gundam", null, 520000m, 30, 4.60m, 12, "1/144", "Gundam SEED", "hg-mighty-strike-freedom", "InStock" },
                    { 19, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), "HG Gundam Calibarn - Gundam cuối cùng của Suletta.", "HG", "/images/products/hg-calibarn.jpg", null, false, false, false, false, "HG Gundam Calibarn", null, 430000m, 25, 4.70m, 18, "1/144", "The Witch from Mercury", "hg-gundam-calibarn", "InStock" },
                    { 20, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 1, 21, 0, 0, 0, 0, DateTimeKind.Utc), "HG Cosmic Era Strike Freedom Gundam với áo giáp vàng kim.", "HG", "/images/products/hgce-strike-freedom.jpg", null, false, false, false, true, "HGCE Strike Freedom Gundam", 580000m, 500000m, 15, 4.50m, 20, "1/144", "Gundam SEED Destiny", "hgce-strike-freedom", "InStock" },
                    { 21, "Bandai", 14, "Mô hình lắp ráp", new DateTime(2026, 1, 22, 0, 0, 0, 0, DateTimeKind.Utc), "SD EX-Standard phiên bản RX-78-2 Gundam nhỏ gọn và dễ ráp.", "SD", "/images/products/sd-rx782.jpg", null, false, false, false, false, "SD EX-Standard RX-78-2 Gundam", null, 200000m, 50, 4.30m, 15, "SD", "Mobile Suit Gundam", "sd-ex-rx-78-2", "InStock" },
                    { 22, "Bandai", 14, "Mô hình lắp ráp", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "SD Gundam World Heroes Wukong Impulse với chủ đề Tề Thiên Đại Thánh.", "SD", "/images/products/sd-wukong.jpg", null, false, false, false, false, "SD Gundam World Heroes Wukong Impulse", null, 280000m, 20, 4.40m, 10, "SD", "SD World Heroes", "sd-wukong-impulse", "InStock" },
                    { 23, "Bandai", 20, "Mô hình lắp ráp", new DateTime(2026, 1, 24, 0, 0, 0, 0, DateTimeKind.Utc), "30 Minutes Missions Alto phiên bản trắng, có thể tùy biến linh hoạt.", "30MM", "/images/products/30mm-alto.jpg", null, false, false, false, false, "30MM eEXM-17 Alto (White)", null, 280000m, 30, 4.40m, 12, "1/144", "30 Minutes Missions", "30mm-alto-white", "InStock" },
                    { 24, "Bandai", 21, "Mô hình lắp ráp", new DateTime(2026, 1, 25, 0, 0, 0, 0, DateTimeKind.Utc), "30 Minutes Sisters Lirinel với nhiều option tùy biến.", "30MS", "/images/products/30ms-lirinel.jpg", null, false, false, false, false, "30MS Lirinel (Color A)", null, 380000m, 18, 4.50m, 8, "1/144", "30 Minutes Sisters", "30ms-lirinel-a", "InStock" },
                    { 25, "Kotobukiya", 22, "Mô hình lắp ráp", new DateTime(2026, 1, 26, 0, 0, 0, 0, DateTimeKind.Utc), "Frame Arms Girl Hresvelgr từ Kotobukiya.", "N/A", "/images/products/fag-hresvelgr.jpg", null, false, false, false, false, "Frame Arms Girl Hresvelgr", null, 1200000m, 10, 4.60m, 14, "N/A", "Frame Arms Girl", "fag-hresvelgr", "InStock" },
                    { 26, "Bandai", 30, "Figure hoàn thiện", new DateTime(2026, 1, 27, 0, 0, 0, 0, DateTimeKind.Utc), "Robot Spirits RX-78-2 phiên bản A.N.I.M.E. với hiệu ứng đầy đủ.", "N/A", "/images/products/rs-rx782.jpg", null, false, false, false, false, "Robot Spirits RX-78-2 Gundam A.N.I.M.E.", null, 1500000m, 8, 4.75m, 16, "N/A", "Mobile Suit Gundam", "rs-rx782-anime", "InStock" },
                    { 27, "Bandai", 31, "Figure hoàn thiện", new DateTime(2026, 1, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Gundam Universe Nu Gundam, figure với giá thành hợp lý.", "N/A", "/images/products/gu-nu-gundam.jpg", null, false, false, false, false, "Gundam Universe RX-93 Nu Gundam", null, 680000m, 12, 4.40m, 9, "N/A", "Char's Counterattack", "gu-nu-gundam", "InStock" },
                    { 28, "GodHand", 40, "Dụng cụ", new DateTime(2026, 1, 29, 0, 0, 0, 0, DateTimeKind.Utc), "Kìm cắt GodHand SPN-120 chuyên dụng cho Gunpla, lưỡi siêu mỏng.", "N/A", "/images/products/godhand-spn120.jpg", null, true, false, false, false, "Godhand SPN-120 Kìm cắt chuyên dụng", null, 1800000m, 15, 4.95m, 52, "N/A", "N/A", "godhand-spn120", "InStock" },
                    { 29, "Tamiya", 42, "Vật tư", new DateTime(2026, 1, 30, 0, 0, 0, 0, DateTimeKind.Utc), "Tamiya Panel Line Accent màu đen, dùng để vẽ đường chỉ panel lining.", "N/A", "/images/products/tamiya-panel.jpg", null, false, false, false, false, "Tamiya Panel Line Accent Color (Black)", null, 120000m, 50, 4.80m, 40, "N/A", "N/A", "tamiya-panel-line-black", "InStock" },
                    { 30, "Bandai", 43, "Phụ kiện", new DateTime(2026, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), "Đế dựng Action Base 1 trong suốt, phù hợp cho HG, MG, RG.", "N/A", "/images/products/action-base-1.jpg", null, false, false, false, false, "Action Base 1 (Clear)", null, 150000m, 60, 4.50m, 25, "N/A", "N/A", "action-base-1-clear", "InStock" },
                    { 31, "Mr. Hobby", 41, "Vật tư", new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Dung dịch pha sơn Mr. Color Leveling Thinner, giúp sơn mịn hơn.", "N/A", "/images/products/mr-thinner.jpg", null, false, false, false, false, "Mr. Color Leveling Thinner 400ml", null, 250000m, 25, 4.70m, 18, "N/A", "N/A", "mr-color-thinner-400", "InStock" },
                    { 32, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Utc), "MG Gundam Exia từ Gundam 00 với thiết kế GN Blade sắc bén và khớp nối linh hoạt.", "MG", "/images/products/mg-exia.jpg", null, false, false, false, false, "MG GN-001 Gundam Exia", null, 1350000m, 20, 4.75m, 22, "1/100", "Gundam 00", "mg-gundam-exia", "InStock" },
                    { 33, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "MG Full Armor Gundam Thunderbolt Ver.Ka với vũ khí và trang bị nặng đầy đủ.", "MG", "/images/products/mg-fa-thunderbolt.jpg", null, true, false, false, false, "MG Full Armor Gundam Ver.Ka (Thunderbolt)", null, 2100000m, 10, 4.88m, 32, "1/100", "Gundam Thunderbolt", "mg-full-armor-gundam-thunderbolt", "InStock" },
                    { 34, "Bandai", 11, "Mô hình lắp ráp", new DateTime(2026, 2, 4, 0, 0, 0, 0, DateTimeKind.Utc), "MG Destiny Gundam Spec II Ver.Ka từ SEED Freedom với Wings of Light.", "MG", "/images/products/mg-destiny-spec2.jpg", null, false, true, true, false, "MG Destiny Gundam Spec II Ver.Ka", null, 2000000m, 0, 4.50m, 3, "1/100", "Gundam SEED", "mg-destiny-spec-ii-ver-ka", "PreOrder" },
                    { 35, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), "RG Gundam Astray Red Frame với katana Gerbera Straight cực chất.", "RG", "/images/products/rg-astray-red.jpg", null, false, false, false, false, "RG Gundam Astray Red Frame", null, 720000m, 18, 4.72m, 19, "1/144", "Gundam SEED", "rg-astray-red-frame", "InStock" },
                    { 36, "Bandai", 12, "Mô hình lắp ráp", new DateTime(2026, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc), "RG Zeong - Mobile Suit khổng lồ của Zeon với hiệu ứng mega particle cannon.", "RG", "/images/products/rg-zeong.jpg", null, false, true, false, false, "RG Zeong", null, 1100000m, 12, 4.82m, 14, "1/144", "Mobile Suit Gundam", "rg-zeong", "InStock" },
                    { 37, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 2, 7, 0, 0, 0, 0, DateTimeKind.Utc), "HG Penelope từ Hathaway's Flash, bộ kit HG kích thước lớn với Fixed Flight Unit.", "HG", "/images/products/hg-penelope.jpg", null, false, false, false, false, "HG Penelope", null, 1200000m, 8, 4.68m, 11, "1/144", "Hathaway's Flash", "hg-penelope", "InStock" },
                    { 38, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 2, 8, 0, 0, 0, 0, DateTimeKind.Utc), "HG Gundam Lfrith - tiền thân của Aerial từ The Witch from Mercury Prologue.", "HG", "/images/products/hg-lfrith.jpg", null, false, false, false, false, "HG Gundam Lfrith", null, 420000m, 0, 4.58m, 16, "1/144", "The Witch from Mercury", "hg-gundam-lfrith", "OutOfStock" },
                    { 39, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 2, 9, 0, 0, 0, 0, DateTimeKind.Utc), "HGBF Try Burning Gundam từ Build Fighters Try với hiệu ứng lửa.", "HG", "/images/products/hgbf-try-burning.jpg", null, false, false, false, true, "HGBF Try Burning Gundam", 450000m, 380000m, 22, 4.52m, 14, "1/144", "Build Fighters", "hgbf-try-burning-gundam", "InStock" },
                    { 40, "Bandai", 13, "Mô hình lắp ráp", new DateTime(2026, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "HG Gundam Pharact với GUND-BIT và thiết kế Peil Technologies.", "HG", "/images/products/hg-pharact.jpg", null, false, false, false, false, "HG Gundam Pharact", null, 460000m, 14, 4.55m, 9, "1/144", "The Witch from Mercury", "hg-gundam-pharact", "InStock" },
                    { 41, "Bandai", 10, "Mô hình lắp ráp", new DateTime(2026, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc), "PG Unicorn Gundam 02 Banshee Norn với cơ chế biến hình Destroy Mode và Armed Armor.", "PG", "/images/products/pg-banshee-norn.jpg", null, false, false, false, false, "PG Banshee Norn", null, 5200000m, 5, 4.85m, 28, "1/60", "Gundam Unicorn", "pg-banshee-norn", "InStock" },
                    { 42, "Bandai", 15, "Mô hình lắp ráp", new DateTime(2026, 2, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Mega Size 1/48 Unicorn Gundam Destroy Mode - kích thước khổng lồ 48cm.", "Mega Size", "/images/products/mega-unicorn.jpg", null, false, false, false, false, "Mega Size Unicorn Gundam (Destroy Mode)", null, 2500000m, 6, 4.45m, 7, "1/48", "Gundam Unicorn", "mega-size-unicorn-destroy", "InStock" },
                    { 43, "Bandai", 14, "Mô hình lắp ráp", new DateTime(2026, 2, 13, 0, 0, 0, 0, DateTimeKind.Utc), "MGSD Freedom Gundam - kết hợp tỉ lệ SD với chi tiết Master Grade.", "SD", "/images/products/mgsd-freedom.jpg", null, false, true, true, false, "MGSD Freedom Gundam", null, 750000m, 0, 4.65m, 4, "SD", "Gundam SEED", "mgsd-freedom-gundam", "PreOrder" },
                    { 44, "Bandai", 20, "Mô hình lắp ráp", new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Utc), "30MM Portanova phiên bản xám đậm, đối thủ của Alto, tùy biến đa dạng.", "30MM", "/images/products/30mm-portanova.jpg", null, false, false, false, false, "30MM bEXM-15 Portanova (Dark Gray)", null, 300000m, 25, 4.35m, 10, "1/144", "30 Minutes Missions", "30mm-portanova-dark-gray", "InStock" },
                    { 45, "Bandai", 30, "Figure hoàn thiện", new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Robot Spirits Sazabi phiên bản A.N.I.M.E. với full hiệu ứng funnel.", "N/A", "/images/products/rs-sazabi.jpg", null, false, false, false, false, "Robot Spirits MSN-04 Sazabi A.N.I.M.E.", null, 2200000m, 7, 4.90m, 21, "N/A", "Char's Counterattack", "rs-sazabi-anime", "InStock" },
                    { 46, "Good Smile Company", 32, "Figure hoàn thiện", new DateTime(2026, 2, 16, 0, 0, 0, 0, DateTimeKind.Utc), "Nendoroid Suletta Mercury cưỡi Gundam Aerial mini cực dễ thương.", "N/A", "/images/products/nendo-suletta.jpg", null, false, false, true, false, "Nendoroid Lfrith (Suletta Mercury)", null, 950000m, 0, 4.70m, 6, "N/A", "The Witch from Mercury", "nendoroid-suletta", "PreOrder" },
                    { 47, "Tamiya", 40, "Dụng cụ", new DateTime(2026, 2, 17, 0, 0, 0, 0, DateTimeKind.Utc), "Kìm cắt Tamiya Sharp Pointed Side Cutter, chất lượng Nhật Bản, phù hợp cho mọi loại runner.", "N/A", "/images/products/tamiya-cutter.jpg", null, false, false, false, false, "Tamiya Kìm cắt Side Cutter", null, 650000m, 30, 4.78m, 24, "N/A", "N/A", "tamiya-side-cutter", "InStock" },
                    { 48, "Mr. Hobby", 41, "Vật tư", new DateTime(2026, 2, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Sơn lót Mr. Surfacer 1000 dạng xịt, lấp đầy vết xước nhỏ và tạo bề mặt bám sơn tốt.", "N/A", "/images/products/mr-surfacer.jpg", null, false, false, false, false, "Mr. Surfacer 1000 Spray", null, 180000m, 35, 4.65m, 15, "N/A", "N/A", "mr-surfacer-1000-spray", "InStock" },
                    { 49, "Bandai", 41, "Vật tư", new DateTime(2026, 2, 19, 0, 0, 0, 0, DateTimeKind.Utc), "Bộ bút Gundam Marker 6 màu cơ bản: đen, xám, nâu, đỏ, vàng, trắng. Hoàn hảo cho panel lining và touch-up.", "N/A", "/images/products/gundam-markers.jpg", null, false, false, false, true, "Gundam Marker Set (6 màu cơ bản)", 350000m, 280000m, 40, 4.55m, 30, "N/A", "N/A", "gundam-marker-set-basic", "InStock" }
                });

            migrationBuilder.InsertData(
                table: "Reviews",
                columns: new[] { "Id", "Content", "CreatedAt", "ProductId", "Rating", "Title", "UserId" },
                values: new object[,]
                {
                    { 1, "Bộ kit PG Unleashed quá đẹp, chi tiết từng milimet. Rất đáng đồng tiền bát gạo!", new DateTime(2026, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 5, "Tuyệt vời!", 1 },
                    { 2, "MG Barbatos thiết kế khung nội thất tuyệt đẹp, khớp chắc chắn.", new DateTime(2026, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), 4, 5, "Barbatos quá đỉnh", 1 },
                    { 3, "Sazabi Ver.Ka là bộ MG hay nhất mà tôi từng ráp. To, đẹp, chi tiết.", new DateTime(2026, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), 8, 5, "Sazabi - Best MG", 1 },
                    { 4, "HG Aerial là bộ kit tuyệt vời cho người mới bắt đầu, dễ ráp và đẹp.", new DateTime(2026, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), 17, 5, "Aerial rất dễ ráp", 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_AuthorId",
                table: "Blogs",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_Slug",
                table: "Blogs",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ParentId",
                table: "Categories",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Slug",
                table: "Categories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_Code",
                table: "Coupons",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderCode",
                table: "Orders",
                column: "OrderCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductQuestions_AnsweredById",
                table: "ProductQuestions",
                column: "AnsweredById");

            migrationBuilder.CreateIndex(
                name: "IX_ProductQuestions_ProductId",
                table: "ProductQuestions",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductQuestions_UserId",
                table: "ProductQuestions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                table: "Products",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ProductId",
                table: "Reviews",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_ProductId",
                table: "Wishlists",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId",
                table: "Wishlists",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "ProductQuestions");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "StoreEvents");

            migrationBuilder.DropTable(
                name: "Wishlists");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
