IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Categories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Slug] nvarchar(200) NOT NULL,
    [Description] nvarchar(500) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [ParentId] int NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Categories_Categories_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Coupons] (
    [Id] int NOT NULL IDENTITY,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(200) NULL,
    [DiscountType] nvarchar(20) NOT NULL,
    [DiscountValue] decimal(18,2) NOT NULL,
    [MinOrderAmount] decimal(18,2) NOT NULL,
    [MaxDiscount] decimal(18,2) NULL,
    [MaxUses] int NOT NULL,
    [UsedCount] int NOT NULL,
    [ExpiresAt] datetime2 NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Coupons] PRIMARY KEY ([Id])
);

CREATE TABLE [StoreEvents] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(300) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Type] nvarchar(30) NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [StartDate] datetime2 NULL,
    [EndDate] datetime2 NULL,
    [ImageUrl] nvarchar(500) NULL,
    [BadgeText] nvarchar(50) NULL,
    [LinkUrl] nvarchar(500) NULL,
    [IsPublished] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_StoreEvents] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Email] nvarchar(200) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [FullName] nvarchar(200) NOT NULL,
    [Phone] nvarchar(20) NULL,
    [Address] nvarchar(500) NULL,
    [Role] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [Products] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(300) NOT NULL,
    [Slug] nvarchar(300) NOT NULL,
    [Description] nvarchar(max) NULL,
    [Price] decimal(18,2) NOT NULL,
    [OriginalPrice] decimal(18,2) NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [Images] nvarchar(2000) NULL,
    [CategoryId] int NOT NULL,
    [Brand] nvarchar(200) NULL,
    [Series] nvarchar(200) NULL,
    [Grade] nvarchar(100) NULL,
    [Scale] nvarchar(50) NULL,
    [Condition] nvarchar(100) NULL,
    [StockStatus] nvarchar(50) NOT NULL,
    [Quantity] int NOT NULL,
    [IsFeatured] bit NOT NULL,
    [IsNewArrival] bit NOT NULL,
    [IsPreorder] bit NOT NULL,
    [IsSale] bit NOT NULL,
    [Rating] decimal(3,2) NOT NULL,
    [ReviewCount] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Blogs] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(300) NOT NULL,
    [Slug] nvarchar(300) NOT NULL,
    [Summary] nvarchar(500) NULL,
    [Content] nvarchar(max) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [AuthorId] int NOT NULL,
    [IsPublished] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Blogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Blogs_Users_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NULL,
    [OrderCode] nvarchar(50) NOT NULL,
    [FullName] nvarchar(200) NOT NULL,
    [Phone] nvarchar(20) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [Email] nvarchar(200) NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [Note] nvarchar(500) NULL,
    [CancellationReason] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [ProductQuestions] (
    [Id] int NOT NULL IDENTITY,
    [ProductId] int NOT NULL,
    [UserId] int NOT NULL,
    [Content] nvarchar(1000) NOT NULL,
    [Answer] nvarchar(max) NULL,
    [AnsweredById] int NULL,
    [CreatedAt] datetime2 NOT NULL,
    [AnsweredAt] datetime2 NULL,
    CONSTRAINT [PK_ProductQuestions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProductQuestions_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ProductQuestions_Users_AnsweredById] FOREIGN KEY ([AnsweredById]) REFERENCES [Users] ([Id]),
    CONSTRAINT [FK_ProductQuestions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Reviews] (
    [Id] int NOT NULL IDENTITY,
    [ProductId] int NOT NULL,
    [UserId] int NOT NULL,
    [Rating] int NOT NULL,
    [Title] nvarchar(200) NULL,
    [Content] nvarchar(2000) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Wishlists] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [ProductId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Wishlists] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Wishlists_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Wishlists_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [ProductId] int NOT NULL,
    [ProductName] nvarchar(300) NOT NULL,
    [ProductImage] nvarchar(500) NULL,
    [Price] decimal(18,2) NOT NULL,
    [Quantity] int NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ImageUrl', N'IsActive', N'Name', N'ParentId', N'Slug', N'SortOrder') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] ON;
INSERT INTO [Categories] ([Id], [Description], [ImageUrl], [IsActive], [Name], [ParentId], [Slug], [SortOrder])
VALUES (1, N'Mô hình Gundam các loại', N'/images/categories/gundam.jpg', CAST(1 AS bit), N'Gundam', NULL, N'gundam', 1),
(2, N'Mô hình lắp ráp khác', N'/images/categories/model-kits.jpg', CAST(1 AS bit), N'Model Kits', NULL, N'model-kits', 2),
(3, N'Mô hình tĩnh & figure', N'/images/categories/figures.jpg', CAST(1 AS bit), N'Figures', NULL, N'figures', 3),
(4, N'Dụng cụ và vật tư làm mô hình', N'/images/categories/tools.jpg', CAST(1 AS bit), N'Dụng Cụ & Vật Tư', NULL, N'dung-cu-vat-tu', 4);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ImageUrl', N'IsActive', N'Name', N'ParentId', N'Slug', N'SortOrder') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'BadgeText', N'CreatedAt', N'Description', N'EndDate', N'ImageUrl', N'IsPublished', N'LinkUrl', N'StartDate', N'Status', N'Title', N'Type') AND [object_id] = OBJECT_ID(N'[StoreEvents]'))
    SET IDENTITY_INSERT [StoreEvents] ON;
INSERT INTO [StoreEvents] ([Id], [BadgeText], [CreatedAt], [Description], [EndDate], [ImageUrl], [IsPublished], [LinkUrl], [StartDate], [Status], [Title], [Type])
VALUES (1, N'HOT', '2026-03-25T00:00:00.0000000Z', N'Giảm giá lên đến 30% cho toàn bộ HG và RG. Cơ hội tuyệt vời để sở hữu những bộ kit yêu thích!', '2026-04-15T00:00:00.0000000Z', NULL, CAST(1 AS bit), N'/san-pham?sort=price-asc', '2026-04-01T00:00:00.0000000Z', N'Active', N'Flash Sale Mùa Hè 2026', N'Sale'),
(2, N'SẮP TỚI', '2026-03-28T00:00:00.0000000Z', N'Kỷ niệm 1 năm M-Shop — Giảm 20% toàn bộ Master Grade khi nhập mã MSHOP1Y.', '2026-05-10T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-05-01T00:00:00.0000000Z', N'Upcoming', N'Gunpla Anniversary Sale', N'Sale'),
(3, NULL, '2026-02-25T00:00:00.0000000Z', N'Thanh lý cuối quý — Giảm 40% các sản phẩm tồn kho, số lượng có hạn!', '2026-03-15T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-03-01T00:00:00.0000000Z', N'Ended', N'Clearance Sale Q1/2026', N'Sale'),
(4, NULL, '2026-01-15T00:00:00.0000000Z', N'Chương trình ưu đãi đặc biệt dịp Tết — Mua 2 tặng phụ kiện Action Base.', '2026-02-05T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-01-20T00:00:00.0000000Z', N'Ended', N'Tết Nguyên Đán Sale', N'Sale'),
(5, N'ĐANG VỀ', '2026-04-01T00:00:00.0000000Z', N'Lô hàng MG Barbatos đã xác nhận từ nhà phân phối. Dự kiến về kho trong tuần.', '2026-04-05T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-04-03T00:00:00.0000000Z', N'Active', N'MG Gundam Barbatos — Restock', N'Restock'),
(6, N'MỚI', '2026-04-01T00:00:00.0000000Z', N'RG God Gundam chính thức phát hành! Số lượng giới hạn, đặt trước ngay.', '2026-04-10T00:00:00.0000000Z', NULL, CAST(1 AS bit), N'/san-pham/rg-god-gundam', '2026-04-10T00:00:00.0000000Z', N'Upcoming', N'RG God Gundam — Hàng Mới', N'NewArrival'),
(7, NULL, '2026-04-02T00:00:00.0000000Z', N'PG Strike Freedom về lại sau thời gian cháy hàng. Đặt trước để đảm bảo.', '2026-04-17T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-04-15T00:00:00.0000000Z', N'Upcoming', N'PG Strike Freedom — Restock', N'Restock'),
(8, N'MỚI', '2026-04-02T00:00:00.0000000Z', N'MGSD Freedom Gundam — dòng SD với chi tiết MG. Đợt đầu tiên về Việt Nam.', '2026-04-22T00:00:00.0000000Z', NULL, CAST(1 AS bit), N'/san-pham/mgsd-freedom-gundam', '2026-04-20T00:00:00.0000000Z', N'Upcoming', N'MGSD Freedom Gundam — Hàng Mới', N'NewArrival'),
(9, N'ĐÃ VỀ', '2026-03-30T00:00:00.0000000Z', N'Bổ sung đầy đủ sơn, keo, và dụng cụ từ Tamiya và Mr.Hobby.', '2026-04-04T00:00:00.0000000Z', NULL, CAST(1 AS bit), NULL, '2026-04-02T00:00:00.0000000Z', N'Active', N'Lô hàng Tamiya & Mr.Hobby', N'Restock'),
(10, N'PRE-ORDER', '2026-03-28T00:00:00.0000000Z', N'Mở đặt trước MG Destiny Spec II Ver.Ka. Giao hàng dự kiến tháng 5.', '2026-05-15T00:00:00.0000000Z', NULL, CAST(1 AS bit), N'/san-pham/mg-destiny-spec-ii-ver-ka', '2026-04-01T00:00:00.0000000Z', N'Active', N'MG Destiny Spec II Ver.Ka — Pre-order', N'NewArrival');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'BadgeText', N'CreatedAt', N'Description', N'EndDate', N'ImageUrl', N'IsPublished', N'LinkUrl', N'StartDate', N'Status', N'Title', N'Type') AND [object_id] = OBJECT_ID(N'[StoreEvents]'))
    SET IDENTITY_INSERT [StoreEvents] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'CreatedAt', N'Email', N'FullName', N'PasswordHash', N'Phone', N'Role') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([Id], [Address], [CreatedAt], [Email], [FullName], [PasswordHash], [Phone], [Role])
VALUES (1, NULL, '2026-01-01T00:00:00.0000000Z', N'admin@mshop.vn', N'M-Shop Admin', N'u91qrx4hcYo7r/KN3MulKcVtz809JuWswywp6pY2Lcw=', N'0901234567', N'Admin'),
(2, NULL, '2026-01-01T00:00:00.0000000Z', N'kho@mshop.vn', N'M-Shop Thủ Kho', N'XaMaRPqbqr8XNFsECJ8rJas9YYaN+TsWOT/EGkfqp7s=', N'0907654321', N'Warehouse');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'CreatedAt', N'Email', N'FullName', N'PasswordHash', N'Phone', N'Role') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ImageUrl', N'IsActive', N'Name', N'ParentId', N'Slug', N'SortOrder') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] ON;
INSERT INTO [Categories] ([Id], [Description], [ImageUrl], [IsActive], [Name], [ParentId], [Slug], [SortOrder])
VALUES (10, NULL, N'/images/categories/pg.jpg', CAST(1 AS bit), N'Perfect Grade (PG)', 1, N'perfect-grade', 1),
(11, NULL, N'/images/categories/mg.jpg', CAST(1 AS bit), N'Master Grade (MG)', 1, N'master-grade', 2),
(12, NULL, N'/images/categories/rg.jpg', CAST(1 AS bit), N'Real Grade (RG)', 1, N'real-grade', 3),
(13, NULL, N'/images/categories/hg.jpg', CAST(1 AS bit), N'High Grade (HG)', 1, N'high-grade', 4),
(14, NULL, N'/images/categories/sd.jpg', CAST(1 AS bit), N'SD Gundam', 1, N'sd-gundam', 5),
(15, NULL, N'/images/categories/mega.jpg', CAST(1 AS bit), N'Mega Size', 1, N'mega-size', 6),
(20, NULL, NULL, CAST(1 AS bit), N'30 Minutes Missions', 2, N'30-minutes-missions', 1),
(21, NULL, NULL, CAST(1 AS bit), N'30 Minutes Sisters', 2, N'30-minutes-sisters', 2),
(22, NULL, NULL, CAST(1 AS bit), N'Frame Arms', 2, N'frame-arms', 3),
(23, NULL, NULL, CAST(1 AS bit), N'Evangelion', 2, N'evangelion', 4),
(24, NULL, NULL, CAST(1 AS bit), N'Zoids', 2, N'zoids', 5),
(30, NULL, NULL, CAST(1 AS bit), N'Robot Spirits', 3, N'robot-spirits', 1),
(31, NULL, NULL, CAST(1 AS bit), N'Gundam Universe', 3, N'gundam-universe', 2),
(32, NULL, NULL, CAST(1 AS bit), N'Nendoroid', 3, N'nendoroid', 3),
(40, NULL, NULL, CAST(1 AS bit), N'Kìm cắt', 4, N'kim-cat', 1),
(41, NULL, NULL, CAST(1 AS bit), N'Sơn mô hình', 4, N'son-mo-hinh', 2),
(42, NULL, NULL, CAST(1 AS bit), N'Keo & Chất trám', 4, N'keo-chat-tram', 3),
(43, NULL, NULL, CAST(1 AS bit), N'Đế dựng', 4, N'de-dung', 4);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Description', N'ImageUrl', N'IsActive', N'Name', N'ParentId', N'Slug', N'SortOrder') AND [object_id] = OBJECT_ID(N'[Categories]'))
    SET IDENTITY_INSERT [Categories] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Brand', N'CategoryId', N'Condition', N'CreatedAt', N'Description', N'Grade', N'ImageUrl', N'Images', N'IsFeatured', N'IsNewArrival', N'IsPreorder', N'IsSale', N'Name', N'OriginalPrice', N'Price', N'Quantity', N'Rating', N'ReviewCount', N'Scale', N'Series', N'Slug', N'StockStatus') AND [object_id] = OBJECT_ID(N'[Products]'))
    SET IDENTITY_INSERT [Products] ON;
INSERT INTO [Products] ([Id], [Brand], [CategoryId], [Condition], [CreatedAt], [Description], [Grade], [ImageUrl], [Images], [IsFeatured], [IsNewArrival], [IsPreorder], [IsSale], [Name], [OriginalPrice], [Price], [Quantity], [Rating], [ReviewCount], [Scale], [Series], [Slug], [StockStatus])
VALUES (1, N'Bandai', 10, N'Mô hình lắp ráp', '2026-01-02T00:00:00.0000000Z', N'Phiên bản PG Unleashed hoàn toàn mới của RX-78-2 Gundam, với độ chi tiết và khớp nối chưa từng có. Bộ kit bao gồm led unit tích hợp và khung nội thất cực kỳ chi tiết.', N'PG', N'/images/products/pg-unleashed-rx782.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'PG Unleashed RX-78-2 Gundam', NULL, 5500000.0, 15, 4.9, 45, N'1/60', N'Mobile Suit Gundam', N'pg-unleashed-rx-78-2-gundam', N'InStock'),
(2, N'Bandai', 10, N'Mô hình lắp ráp', '2026-01-03T00:00:00.0000000Z', N'PG Unicorn Gundam với cơ chế biến hình Destroy Mode hoàn chỉnh. LED Unit bán riêng.', N'PG', N'/images/products/pg-unicorn.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), N'PG RX-0 Unicorn Gundam', 5200000.0, 4800000.0, 8, 4.8, 38, N'1/60', N'Gundam Unicorn', N'pg-rx-0-unicorn-gundam', N'InStock'),
(3, N'Bandai', 10, N'Mô hình lắp ráp', '2026-01-04T00:00:00.0000000Z', N'PG Strike Freedom Gundam với hiệu ứng cánh DRAGOON tuyệt đẹp.', N'PG', N'/images/products/pg-strike-freedom.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'PG Strike Freedom Gundam', NULL, 5800000.0, 0, 4.7, 12, N'1/60', N'Gundam SEED Destiny', N'pg-strike-freedom-gundam', N'PreOrder'),
(4, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-05T00:00:00.0000000Z', N'MG Gundam Barbatos từ series Iron-Blooded Orphans. Thiết kế khung nội thất cực chi tiết.', N'MG', N'/images/products/mg-barbatos.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'MG ASW-G-08 Gundam Barbatos', NULL, 1400000.0, 0, 4.95, 61, N'1/100', N'Iron-Blooded Orphans', N'mg-asw-g-08-gundam-barbatos', N'PreOrder'),
(5, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-06T00:00:00.0000000Z', N'MG Freedom Gundam phiên bản 2.0 với cải tiến toàn diện về khớp nối và chi tiết.', N'MG', N'/images/products/mg-freedom-v2.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Freedom Gundam Ver.2.0', NULL, 1400000.0, 25, 4.85, 26, N'1/100', N'Gundam SEED', N'mg-freedom-gundam-ver-2', N'InStock'),
(6, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-07T00:00:00.0000000Z', N'MG Wing Gundam Zero EW phiên bản Ver.Ka, thiết kế bởi Hajime Katoki. Đôi cánh thiên thần ấn tượng.', N'MG', N'/images/products/mg-wing-zero.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Wing Gundam Zero EW Ver.Ka', NULL, 1700000.0, 20, 4.8, 28, N'1/100', N'Gundam Wing', N'mg-wing-zero-ew-ver-ka', N'InStock'),
(7, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-08T00:00:00.0000000Z', N'Phiên bản thứ 3 của MG RX-78-2 với công nghệ khớp nối mới nhất.', N'MG', N'/images/products/mg-rx782-v3.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG RX-78-2 Gundam Ver.3.0', NULL, 1450000.0, 30, 4.7, 18, N'1/100', N'Mobile Suit Gundam', N'mg-rx-78-2-ver-3', N'InStock'),
(8, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-09T00:00:00.0000000Z', N'MG Sazabi Ver.Ka - một trong những bộ MG lớn nhất và chi tiết nhất từ trước đến nay.', N'MG', N'/images/products/mg-sazabi.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Sazabi Ver.Ka', NULL, 2200000.0, 12, 4.95, 55, N'1/100', N'Char''s Counterattack', N'mg-sazabi-ver-ka', N'InStock'),
(9, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-10T00:00:00.0000000Z', N'MG Nu Gundam Ver.Ka với Fin Funnel có thể tháo rời và đế dựng chuyên dụng.', N'MG', N'/images/products/mg-nu-gundam.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Nu Gundam Ver.Ka', NULL, 2000000.0, 10, 4.9, 42, N'1/100', N'Char''s Counterattack', N'mg-nu-gundam-ver-ka', N'InStock'),
(10, N'Bandai', 11, N'Mô hình lắp ráp', '2026-01-11T00:00:00.0000000Z', N'MG Deathscythe Hell phiên bản Ver.Ka từ Gundam Wing Endless Waltz.', N'MG', N'/images/products/mg-deathscythe.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Deathscythe Hell EW Ver.Ka', NULL, 1300000.0, 18, 4.75, 25, N'1/100', N'Gundam Wing', N'mg-deathscythe-hell-ew', N'InStock'),
(11, N'Bandai', 12, N'Mô hình lắp ráp', '2026-01-12T00:00:00.0000000Z', N'RG Hi-Nu Gundam với Fin Funnel cực kỳ chi tiết ở tỉ lệ 1/144.', N'RG', N'/images/products/rg-hi-nu.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Hi-Nu Gundam', NULL, 950000.0, 22, 4.85, 34, N'1/144', N'Char''s Counterattack', N'rg-hi-nu-gundam', N'InStock'),
(12, N'Bandai', 12, N'Mô hình lắp ráp', '2026-01-13T00:00:00.0000000Z', N'RG Evangelion Unit-01 với chi tiết đáng kinh ngạc ở tỉ lệ nhỏ.', N'RG', N'/images/products/rg-eva-01.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Evangelion Unit-01', NULL, 850000.0, 15, 4.8, 20, N'1/144', N'Evangelion', N'rg-evangelion-unit-01', N'InStock'),
(13, N'Bandai', 12, N'Mô hình lắp ráp', '2026-01-14T00:00:00.0000000Z', N'RG Wing Gundam Zero phiên bản Endless Waltz với cánh có thể mở rộng.', N'RG', N'/images/products/rg-wing-zero.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Wing Gundam Zero EW', NULL, 750000.0, 28, 4.75, 22, N'1/144', N'Gundam Wing', N'rg-wing-zero-ew', N'InStock'),
(14, N'Bandai', 12, N'Mô hình lắp ráp', '2026-01-15T00:00:00.0000000Z', N'RG Force Impulse Gundam Spec II từ SEED Freedom.', N'RG', N'/images/products/rg-force-impulse.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Force Impulse Gundam Spec II', NULL, 800000.0, 20, 4.7, 8, N'1/144', N'Gundam SEED', N'rg-force-impulse-spec-ii', N'InStock'),
(15, N'Bandai', 12, N'Mô hình lắp ráp', '2026-01-16T00:00:00.0000000Z', N'RG God Gundam (Burning Gundam) từ G Gundam.', N'RG', N'/images/products/rg-god-gundam.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'RG God Gundam', NULL, 780000.0, 0, 4.6, 5, N'1/144', N'G Gundam', N'rg-god-gundam', N'PreOrder'),
(16, N'Bandai', 13, N'Mô hình lắp ráp', '2026-01-17T00:00:00.0000000Z', N'HG Gundam Aerial từ The Witch from Mercury. Bộ kit với thiết kế hiện đại.', N'HG', N'/images/products/hg-aerial.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Gundam Aerial', NULL, 450000.0, 40, 4.65, 30, N'1/144', N'The Witch from Mercury', N'hg-gundam-aerial', N'InStock'),
(17, N'Bandai', 13, N'Mô hình lắp ráp', '2026-01-18T00:00:00.0000000Z', N'HG Schwarzette với màu đen huyền bí từ The Witch from Mercury.', N'HG', N'/images/products/hg-schwarzette.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Schwarzette', NULL, 480000.0, 35, 4.55, 15, N'1/144', N'The Witch from Mercury', N'hg-schwarzette', N'InStock'),
(18, N'Bandai', 13, N'Mô hình lắp ráp', '2026-01-19T00:00:00.0000000Z', N'HG Mighty Strike Freedom Gundam từ phim SEED Freedom.', N'HG', N'/images/products/hg-mighty-sf.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Mighty Strike Freedom Gundam', NULL, 520000.0, 30, 4.6, 12, N'1/144', N'Gundam SEED', N'hg-mighty-strike-freedom', N'InStock'),
(19, N'Bandai', 13, N'Mô hình lắp ráp', '2026-01-20T00:00:00.0000000Z', N'HG Gundam Calibarn - Gundam cuối cùng của Suletta.', N'HG', N'/images/products/hg-calibarn.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Gundam Calibarn', NULL, 430000.0, 25, 4.7, 18, N'1/144', N'The Witch from Mercury', N'hg-gundam-calibarn', N'InStock'),
(20, N'Bandai', 13, N'Mô hình lắp ráp', '2026-01-21T00:00:00.0000000Z', N'HG Cosmic Era Strike Freedom Gundam với áo giáp vàng kim.', N'HG', N'/images/products/hgce-strike-freedom.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), N'HGCE Strike Freedom Gundam', 580000.0, 500000.0, 15, 4.5, 20, N'1/144', N'Gundam SEED Destiny', N'hgce-strike-freedom', N'InStock'),
(21, N'Bandai', 14, N'Mô hình lắp ráp', '2026-01-22T00:00:00.0000000Z', N'SD EX-Standard phiên bản RX-78-2 Gundam nhỏ gọn và dễ ráp.', N'SD', N'/images/products/sd-rx782.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'SD EX-Standard RX-78-2 Gundam', NULL, 200000.0, 50, 4.3, 15, N'SD', N'Mobile Suit Gundam', N'sd-ex-rx-78-2', N'InStock'),
(22, N'Bandai', 14, N'Mô hình lắp ráp', '2026-01-23T00:00:00.0000000Z', N'SD Gundam World Heroes Wukong Impulse với chủ đề Tề Thiên Đại Thánh.', N'SD', N'/images/products/sd-wukong.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'SD Gundam World Heroes Wukong Impulse', NULL, 280000.0, 20, 4.4, 10, N'SD', N'SD World Heroes', N'sd-wukong-impulse', N'InStock'),
(23, N'Bandai', 20, N'Mô hình lắp ráp', '2026-01-24T00:00:00.0000000Z', N'30 Minutes Missions Alto phiên bản trắng, có thể tùy biến linh hoạt.', N'30MM', N'/images/products/30mm-alto.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'30MM eEXM-17 Alto (White)', NULL, 280000.0, 30, 4.4, 12, N'1/144', N'30 Minutes Missions', N'30mm-alto-white', N'InStock'),
(24, N'Bandai', 21, N'Mô hình lắp ráp', '2026-01-25T00:00:00.0000000Z', N'30 Minutes Sisters Lirinel với nhiều option tùy biến.', N'30MS', N'/images/products/30ms-lirinel.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'30MS Lirinel (Color A)', NULL, 380000.0, 18, 4.5, 8, N'1/144', N'30 Minutes Sisters', N'30ms-lirinel-a', N'InStock'),
(25, N'Kotobukiya', 22, N'Mô hình lắp ráp', '2026-01-26T00:00:00.0000000Z', N'Frame Arms Girl Hresvelgr từ Kotobukiya.', N'N/A', N'/images/products/fag-hresvelgr.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Frame Arms Girl Hresvelgr', NULL, 1200000.0, 10, 4.6, 14, N'N/A', N'Frame Arms Girl', N'fag-hresvelgr', N'InStock'),
(26, N'Bandai', 30, N'Figure hoàn thiện', '2026-01-27T00:00:00.0000000Z', N'Robot Spirits RX-78-2 phiên bản A.N.I.M.E. với hiệu ứng đầy đủ.', N'N/A', N'/images/products/rs-rx782.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Robot Spirits RX-78-2 Gundam A.N.I.M.E.', NULL, 1500000.0, 8, 4.75, 16, N'N/A', N'Mobile Suit Gundam', N'rs-rx782-anime', N'InStock'),
(27, N'Bandai', 31, N'Figure hoàn thiện', '2026-01-28T00:00:00.0000000Z', N'Gundam Universe Nu Gundam, figure với giá thành hợp lý.', N'N/A', N'/images/products/gu-nu-gundam.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Gundam Universe RX-93 Nu Gundam', NULL, 680000.0, 12, 4.4, 9, N'N/A', N'Char''s Counterattack', N'gu-nu-gundam', N'InStock'),
(28, N'GodHand', 40, N'Dụng cụ', '2026-01-29T00:00:00.0000000Z', N'Kìm cắt GodHand SPN-120 chuyên dụng cho Gunpla, lưỡi siêu mỏng.', N'N/A', N'/images/products/godhand-spn120.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Godhand SPN-120 Kìm cắt chuyên dụng', NULL, 1800000.0, 15, 4.95, 52, N'N/A', N'N/A', N'godhand-spn120', N'InStock'),
(29, N'Tamiya', 42, N'Vật tư', '2026-01-30T00:00:00.0000000Z', N'Tamiya Panel Line Accent màu đen, dùng để vẽ đường chỉ panel lining.', N'N/A', N'/images/products/tamiya-panel.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Tamiya Panel Line Accent Color (Black)', NULL, 120000.0, 50, 4.8, 40, N'N/A', N'N/A', N'tamiya-panel-line-black', N'InStock'),
(30, N'Bandai', 43, N'Phụ kiện', '2026-01-31T00:00:00.0000000Z', N'Đế dựng Action Base 1 trong suốt, phù hợp cho HG, MG, RG.', N'N/A', N'/images/products/action-base-1.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Action Base 1 (Clear)', NULL, 150000.0, 60, 4.5, 25, N'N/A', N'N/A', N'action-base-1-clear', N'InStock'),
(31, N'Mr. Hobby', 41, N'Vật tư', '2026-02-01T00:00:00.0000000Z', N'Dung dịch pha sơn Mr. Color Leveling Thinner, giúp sơn mịn hơn.', N'N/A', N'/images/products/mr-thinner.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Mr. Color Leveling Thinner 400ml', NULL, 250000.0, 25, 4.7, 18, N'N/A', N'N/A', N'mr-color-thinner-400', N'InStock'),
(32, N'Bandai', 11, N'Mô hình lắp ráp', '2026-02-02T00:00:00.0000000Z', N'MG Gundam Exia từ Gundam 00 với thiết kế GN Blade sắc bén và khớp nối linh hoạt.', N'MG', N'/images/products/mg-exia.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG GN-001 Gundam Exia', NULL, 1350000.0, 20, 4.75, 22, N'1/100', N'Gundam 00', N'mg-gundam-exia', N'InStock'),
(33, N'Bandai', 11, N'Mô hình lắp ráp', '2026-02-03T00:00:00.0000000Z', N'MG Full Armor Gundam Thunderbolt Ver.Ka với vũ khí và trang bị nặng đầy đủ.', N'MG', N'/images/products/mg-fa-thunderbolt.jpg', NULL, CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'MG Full Armor Gundam Ver.Ka (Thunderbolt)', NULL, 2100000.0, 10, 4.88, 32, N'1/100', N'Gundam Thunderbolt', N'mg-full-armor-gundam-thunderbolt', N'InStock'),
(34, N'Bandai', 11, N'Mô hình lắp ráp', '2026-02-04T00:00:00.0000000Z', N'MG Destiny Gundam Spec II Ver.Ka từ SEED Freedom với Wings of Light.', N'MG', N'/images/products/mg-destiny-spec2.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'MG Destiny Gundam Spec II Ver.Ka', NULL, 2000000.0, 0, 4.5, 3, N'1/100', N'Gundam SEED', N'mg-destiny-spec-ii-ver-ka', N'PreOrder'),
(35, N'Bandai', 12, N'Mô hình lắp ráp', '2026-02-05T00:00:00.0000000Z', N'RG Gundam Astray Red Frame với katana Gerbera Straight cực chất.', N'RG', N'/images/products/rg-astray-red.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Gundam Astray Red Frame', NULL, 720000.0, 18, 4.72, 19, N'1/144', N'Gundam SEED', N'rg-astray-red-frame', N'InStock'),
(36, N'Bandai', 12, N'Mô hình lắp ráp', '2026-02-06T00:00:00.0000000Z', N'RG Zeong - Mobile Suit khổng lồ của Zeon với hiệu ứng mega particle cannon.', N'RG', N'/images/products/rg-zeong.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'RG Zeong', NULL, 1100000.0, 12, 4.82, 14, N'1/144', N'Mobile Suit Gundam', N'rg-zeong', N'InStock'),
(37, N'Bandai', 13, N'Mô hình lắp ráp', '2026-02-07T00:00:00.0000000Z', N'HG Penelope từ Hathaway''s Flash, bộ kit HG kích thước lớn với Fixed Flight Unit.', N'HG', N'/images/products/hg-penelope.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Penelope', NULL, 1200000.0, 8, 4.68, 11, N'1/144', N'Hathaway''s Flash', N'hg-penelope', N'InStock'),
(38, N'Bandai', 13, N'Mô hình lắp ráp', '2026-02-08T00:00:00.0000000Z', N'HG Gundam Lfrith - tiền thân của Aerial từ The Witch from Mercury Prologue.', N'HG', N'/images/products/hg-lfrith.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Gundam Lfrith', NULL, 420000.0, 0, 4.58, 16, N'1/144', N'The Witch from Mercury', N'hg-gundam-lfrith', N'OutOfStock'),
(39, N'Bandai', 13, N'Mô hình lắp ráp', '2026-02-09T00:00:00.0000000Z', N'HGBF Try Burning Gundam từ Build Fighters Try với hiệu ứng lửa.', N'HG', N'/images/products/hgbf-try-burning.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), N'HGBF Try Burning Gundam', 450000.0, 380000.0, 22, 4.52, 14, N'1/144', N'Build Fighters', N'hgbf-try-burning-gundam', N'InStock'),
(40, N'Bandai', 13, N'Mô hình lắp ráp', '2026-02-10T00:00:00.0000000Z', N'HG Gundam Pharact với GUND-BIT và thiết kế Peil Technologies.', N'HG', N'/images/products/hg-pharact.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'HG Gundam Pharact', NULL, 460000.0, 14, 4.55, 9, N'1/144', N'The Witch from Mercury', N'hg-gundam-pharact', N'InStock'),
(41, N'Bandai', 10, N'Mô hình lắp ráp', '2026-02-11T00:00:00.0000000Z', N'PG Unicorn Gundam 02 Banshee Norn với cơ chế biến hình Destroy Mode và Armed Armor.', N'PG', N'/images/products/pg-banshee-norn.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'PG Banshee Norn', NULL, 5200000.0, 5, 4.85, 28, N'1/60', N'Gundam Unicorn', N'pg-banshee-norn', N'InStock'),
(42, N'Bandai', 15, N'Mô hình lắp ráp', '2026-02-12T00:00:00.0000000Z', N'Mega Size 1/48 Unicorn Gundam Destroy Mode - kích thước khổng lồ 48cm.', N'Mega Size', N'/images/products/mega-unicorn.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Mega Size Unicorn Gundam (Destroy Mode)', NULL, 2500000.0, 6, 4.45, 7, N'1/48', N'Gundam Unicorn', N'mega-size-unicorn-destroy', N'InStock');
INSERT INTO [Products] ([Id], [Brand], [CategoryId], [Condition], [CreatedAt], [Description], [Grade], [ImageUrl], [Images], [IsFeatured], [IsNewArrival], [IsPreorder], [IsSale], [Name], [OriginalPrice], [Price], [Quantity], [Rating], [ReviewCount], [Scale], [Series], [Slug], [StockStatus])
VALUES (43, N'Bandai', 14, N'Mô hình lắp ráp', '2026-02-13T00:00:00.0000000Z', N'MGSD Freedom Gundam - kết hợp tỉ lệ SD với chi tiết Master Grade.', N'SD', N'/images/products/mgsd-freedom.jpg', NULL, CAST(0 AS bit), CAST(1 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'MGSD Freedom Gundam', NULL, 750000.0, 0, 4.65, 4, N'SD', N'Gundam SEED', N'mgsd-freedom-gundam', N'PreOrder'),
(44, N'Bandai', 20, N'Mô hình lắp ráp', '2026-02-14T00:00:00.0000000Z', N'30MM Portanova phiên bản xám đậm, đối thủ của Alto, tùy biến đa dạng.', N'30MM', N'/images/products/30mm-portanova.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'30MM bEXM-15 Portanova (Dark Gray)', NULL, 300000.0, 25, 4.35, 10, N'1/144', N'30 Minutes Missions', N'30mm-portanova-dark-gray', N'InStock'),
(45, N'Bandai', 30, N'Figure hoàn thiện', '2026-02-15T00:00:00.0000000Z', N'Robot Spirits Sazabi phiên bản A.N.I.M.E. với full hiệu ứng funnel.', N'N/A', N'/images/products/rs-sazabi.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Robot Spirits MSN-04 Sazabi A.N.I.M.E.', NULL, 2200000.0, 7, 4.9, 21, N'N/A', N'Char''s Counterattack', N'rs-sazabi-anime', N'InStock'),
(46, N'Good Smile Company', 32, N'Figure hoàn thiện', '2026-02-16T00:00:00.0000000Z', N'Nendoroid Suletta Mercury cưỡi Gundam Aerial mini cực dễ thương.', N'N/A', N'/images/products/nendo-suletta.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), CAST(0 AS bit), N'Nendoroid Lfrith (Suletta Mercury)', NULL, 950000.0, 0, 4.7, 6, N'N/A', N'The Witch from Mercury', N'nendoroid-suletta', N'PreOrder'),
(47, N'Tamiya', 40, N'Dụng cụ', '2026-02-17T00:00:00.0000000Z', N'Kìm cắt Tamiya Sharp Pointed Side Cutter, chất lượng Nhật Bản, phù hợp cho mọi loại runner.', N'N/A', N'/images/products/tamiya-cutter.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Tamiya Kìm cắt Side Cutter', NULL, 650000.0, 30, 4.78, 24, N'N/A', N'N/A', N'tamiya-side-cutter', N'InStock'),
(48, N'Mr. Hobby', 41, N'Vật tư', '2026-02-18T00:00:00.0000000Z', N'Sơn lót Mr. Surfacer 1000 dạng xịt, lấp đầy vết xước nhỏ và tạo bề mặt bám sơn tốt.', N'N/A', N'/images/products/mr-surfacer.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), N'Mr. Surfacer 1000 Spray', NULL, 180000.0, 35, 4.65, 15, N'N/A', N'N/A', N'mr-surfacer-1000-spray', N'InStock'),
(49, N'Bandai', 41, N'Vật tư', '2026-02-19T00:00:00.0000000Z', N'Bộ bút Gundam Marker 6 màu cơ bản: đen, xám, nâu, đỏ, vàng, trắng. Hoàn hảo cho panel lining và touch-up.', N'N/A', N'/images/products/gundam-markers.jpg', NULL, CAST(0 AS bit), CAST(0 AS bit), CAST(0 AS bit), CAST(1 AS bit), N'Gundam Marker Set (6 màu cơ bản)', 350000.0, 280000.0, 40, 4.55, 30, N'N/A', N'N/A', N'gundam-marker-set-basic', N'InStock');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Brand', N'CategoryId', N'Condition', N'CreatedAt', N'Description', N'Grade', N'ImageUrl', N'Images', N'IsFeatured', N'IsNewArrival', N'IsPreorder', N'IsSale', N'Name', N'OriginalPrice', N'Price', N'Quantity', N'Rating', N'ReviewCount', N'Scale', N'Series', N'Slug', N'StockStatus') AND [object_id] = OBJECT_ID(N'[Products]'))
    SET IDENTITY_INSERT [Products] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Content', N'CreatedAt', N'ProductId', N'Rating', N'Title', N'UserId') AND [object_id] = OBJECT_ID(N'[Reviews]'))
    SET IDENTITY_INSERT [Reviews] ON;
INSERT INTO [Reviews] ([Id], [Content], [CreatedAt], [ProductId], [Rating], [Title], [UserId])
VALUES (1, N'Bộ kit PG Unleashed quá đẹp, chi tiết từng milimet. Rất đáng đồng tiền bát gạo!', '2026-02-01T00:00:00.0000000Z', 1, 5, N'Tuyệt vời!', 1),
(2, N'MG Barbatos thiết kế khung nội thất tuyệt đẹp, khớp chắc chắn.', '2026-02-05T00:00:00.0000000Z', 4, 5, N'Barbatos quá đỉnh', 1),
(3, N'Sazabi Ver.Ka là bộ MG hay nhất mà tôi từng ráp. To, đẹp, chi tiết.', '2026-02-10T00:00:00.0000000Z', 8, 5, N'Sazabi - Best MG', 1),
(4, N'HG Aerial là bộ kit tuyệt vời cho người mới bắt đầu, dễ ráp và đẹp.', '2026-02-15T00:00:00.0000000Z', 17, 5, N'Aerial rất dễ ráp', 1);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Content', N'CreatedAt', N'ProductId', N'Rating', N'Title', N'UserId') AND [object_id] = OBJECT_ID(N'[Reviews]'))
    SET IDENTITY_INSERT [Reviews] OFF;

CREATE INDEX [IX_Blogs_AuthorId] ON [Blogs] ([AuthorId]);

CREATE UNIQUE INDEX [IX_Blogs_Slug] ON [Blogs] ([Slug]);

CREATE INDEX [IX_Categories_ParentId] ON [Categories] ([ParentId]);

CREATE UNIQUE INDEX [IX_Categories_Slug] ON [Categories] ([Slug]);

CREATE UNIQUE INDEX [IX_Coupons_Code] ON [Coupons] ([Code]);

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);

CREATE UNIQUE INDEX [IX_Orders_OrderCode] ON [Orders] ([OrderCode]);

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);

CREATE INDEX [IX_ProductQuestions_AnsweredById] ON [ProductQuestions] ([AnsweredById]);

CREATE INDEX [IX_ProductQuestions_ProductId] ON [ProductQuestions] ([ProductId]);

CREATE INDEX [IX_ProductQuestions_UserId] ON [ProductQuestions] ([UserId]);

CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);

CREATE UNIQUE INDEX [IX_Products_Slug] ON [Products] ([Slug]);

CREATE INDEX [IX_Reviews_ProductId] ON [Reviews] ([ProductId]);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);

CREATE INDEX [IX_Wishlists_ProductId] ON [Wishlists] ([ProductId]);

CREATE INDEX [IX_Wishlists_UserId] ON [Wishlists] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260406065148_InitialMigration', N'10.0.5');

COMMIT;
GO

