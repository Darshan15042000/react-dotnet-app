using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Training_BE.Data;
using Training_BE.DTOs.DeliveryPartnerDTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class DeliveryPartnerAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public DeliveryPartnerAuthService(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // REGISTER
        public async Task<DeliveryPartner> Register(DeliveryPartnerRegisterDto dto)
        {
            var exists = await _db.DeliveryPartners
                .FirstOrDefaultAsync(dp => dp.PhoneNumber == dto.PhoneNumber);

            if (exists != null)
                throw new Exception("Phone number already registered!");

            var partner = new DeliveryPartner
            {
                Name = dto.Name,
                PhoneNumber = dto.PhoneNumber,
                Pincode = dto.Pincode,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "DeliveryPartner",
                IsActive = true,
                MaxActiveOrders = 10
            };

            _db.DeliveryPartners.Add(partner);
            await _db.SaveChangesAsync();

            return partner;
        }

        // LOGIN
        public async Task<string> Login(DeliveryPartnerLoginDto dto)
        {
            var partner = await _db.DeliveryPartners
                .FirstOrDefaultAsync(dp => dp.PhoneNumber == dto.PhoneNumber);

            if (partner == null)
                return null;

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, partner.PasswordHash);

            if (!validPassword)
                return null;

            return GenerateToken(partner);
        }

        private string GenerateToken(DeliveryPartner partner)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("id", partner.Id.ToString()),
                    new Claim("name", partner.Name),
                    new Claim("role", partner.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(2),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
