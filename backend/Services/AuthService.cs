using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MShop.API.Data;
using MShop.API.DTOs;
using MShop.API.Models;

namespace MShop.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResponseDto> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Email đã được sử dụng.");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                FullName = dto.FullName,
                Phone = dto.Phone,
                Role = "User"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token = GenerateJwt(user),
                User = MapUser(user)
            };
        }

        public async Task<AuthResponseDto> Login(LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                throw new Exception("Email hoặc mật khẩu không đúng.");

            return new AuthResponseDto
            {
                Token = GenerateJwt(user),
                User = MapUser(user)
            };
        }

        public async Task<AuthResponseDto> GoogleLogin(GoogleLoginDto dto)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"] }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                // If ClientId is not configured, we only validate the signature (less secure)
                if (string.IsNullOrEmpty(_config["Google:ClientId"]))
                {
                    payload = await GoogleJsonWebSignature.ValidateAsync(dto.Credential);
                }
                else
                {
                    payload = await GoogleJsonWebSignature.ValidateAsync(dto.Credential, settings);
                }
            }
            catch
            {
                throw new Exception("Xác thực Google thất bại.");
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
            if (user == null)
            {
                user = new User
                {
                    Email = payload.Email,
                    FullName = payload.Name ?? "Google User",
                    PasswordHash = HashPassword(Guid.NewGuid().ToString()), // Random dummy password
                    Role = "User"
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();
            }

            return new AuthResponseDto
            {
                Token = GenerateJwt(user),
                User = MapUser(user)
            };
        }

        public async Task<UserDto> GetProfile(int userId)
        {
            var user = await _db.Users.FindAsync(userId)
                ?? throw new Exception("Không tìm thấy người dùng.");
            return MapUser(user);
        }

        public async Task<UserDto> UpdateProfile(int userId, UpdateProfileDto dto)
        {
            var user = await _db.Users.FindAsync(userId)
                ?? throw new Exception("Không tìm thấy người dùng.");

            if (dto.FullName != null) user.FullName = dto.FullName;
            if (dto.Phone != null) user.Phone = dto.Phone;
            if (dto.Address != null) user.Address = dto.Address;

            await _db.SaveChangesAsync();
            return MapUser(user);
        }

        private string GenerateJwt(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "MShopSalt2026"));
            return Convert.ToBase64String(bytes);
        }

        private static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }

        private static UserDto MapUser(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Phone = user.Phone,
            Address = user.Address,
            Role = user.Role
        };

        // ============ Password Reset ============
        // In-memory store for simplicity (production: use DB table)
        private static readonly Dictionary<string, (int UserId, DateTime Expiry)> _resetTokens = new();

        public async Task<string?> ForgotPassword(string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null; // Don't reveal if email exists

            var token = Guid.NewGuid().ToString("N")[..8].ToUpper();
            _resetTokens[token] = (user.Id, DateTime.UtcNow.AddMinutes(30));
            return token;
        }

        public async Task<bool> ResetPassword(string token, string newPassword)
        {
            if (!_resetTokens.TryGetValue(token, out var data)) return false;
            if (data.Expiry < DateTime.UtcNow) { _resetTokens.Remove(token); return false; }

            var user = await _db.Users.FindAsync(data.UserId);
            if (user == null) return false;

            user.PasswordHash = HashPassword(newPassword);
            await _db.SaveChangesAsync();
            _resetTokens.Remove(token);
            return true;
        }

        public async Task<bool> ChangePassword(int userId, string currentPassword, string newPassword)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null) return false;
            if (!VerifyPassword(currentPassword, user.PasswordHash)) return false;

            user.PasswordHash = HashPassword(newPassword);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
