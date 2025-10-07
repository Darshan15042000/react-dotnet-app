using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs;
using Training_BE.Models;
using Training_BE.Services;

namespace Training_BE.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            try
            {
                var user = await _authService.Register(dto);
                return Ok(new { user.Id, user.Username, user.Email, user.Role });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var token = await _authService.Login(dto);
            if (token == null)
                return Unauthorized(new { message = "Invalid username or password" });

            // Decode the token to get role claim
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);
            var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;
            var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

            return Ok(new
            {
                token = token,   // JWT token
                role = roleClaim, // user role
                username = usernameClaim // collect usename from jwt
            });
        }


    }
}
