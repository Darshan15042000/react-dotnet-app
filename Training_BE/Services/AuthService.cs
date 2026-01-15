using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Training_BE.Data;
using Training_BE.DTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ApplicationDbContext db, IConfiguration config, ILogger<AuthService> logger)
        {
            _db = db;
            _config = config;
            _logger = logger;
        }


        public async Task<User> Register(UserRegisterDto dto)
        {
            _logger.LogInformation("Registration started for username: {Username}, email: {Email} at {Time}", dto.Username, dto.Email,DateTime.UtcNow);

            try
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                var user = new User
                {
                    Id = Guid.NewGuid(),   // ⭐ REQUIRED ⭐
                    Username = dto.Username,
                    Email = dto.Email,
                    PasswordHash = hashedPassword,
                    Role = dto.Role
                };


                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                _logger.LogInformation("User registered successfully: {Username}, role: {Role} at {Time}", user.Username, user.Role,DateTime.UtcNow);

                return user;
            }
            catch(Exception e)
            {
                _logger.LogError(e, "Error occurred during registration for username: {Username} at {Time}", dto.Username, DateTime.UtcNow);
                throw;
            }
        }

        public async Task<string> Login(UserLoginDto dto)
        {
            _logger.LogInformation("Login attempt for user: {Username} at {Time}", dto.Username, DateTime.UtcNow);


            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null) 
            {
                _logger.LogWarning("Login failed: User {Username} not found ", dto.Username);
                return null;
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!validPassword) 
            {
                _logger.LogWarning("Login failed: Invalid password for {Username} ", dto.Username);
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim("username", user.Username),

                    //  simplified claim important!
                    new Claim("role", user.Role),
                    new Claim (ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:TokenValidityInMinutes"])),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            _logger.LogInformation("Login successful for user: {Username} at {Time} with Eeeeemail: {Email}", dto.Username, DateTime.UtcNow,user.Email);

            return jwt;
        }
    }
}

