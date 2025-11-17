using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs.DeliveryPartnerDTOs;
using Training_BE.Services;

namespace Training_BE.Controllers
{
    [ApiController]
    [Route("api/deliverypartner")]
    public class DeliveryPartnerAuthController : ControllerBase
    {
        private readonly DeliveryPartnerAuthService _authService;

        public DeliveryPartnerAuthController(DeliveryPartnerAuthService authService)
        {
            _authService = authService;
        }


        // testing api
        [HttpGet("Testing")]
        [Authorize(Roles = "DeliveryPartner")]

        public string Testing()
        {
            return "Yes only delivery boy can access this api";
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(DeliveryPartnerRegisterDto dto)
        {
            try
            {
                var partner = await _authService.Register(dto);

                return Ok(new
                {
                    message = "Delivery Partner Registered Successfully",
                    partner.Id,
                    partner.Name,
                    partner.PhoneNumber,
                    partner.Pincode,
                    partner.Email,
                    partner.Role,
                    partner.IsActive,
                    partner.MaxActiveOrders
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(DeliveryPartnerLoginDto dto)
        {
            var token = await _authService.Login(dto);

            if (token == null)
                return Unauthorized(new { message = "Invalid phone number or password" });

            return Ok(new
            {
                token,
                role = "DeliveryPartner"
            });
        }
    }
}
