using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs.DeliveryPartnerDTOs;
using Training_BE.Services;

namespace Training_BE.Controllers
{
    [ApiController]
    [Route("api/deliverypartner")]
    public class DeliveryPartnerOrdersController : ControllerBase
    {
        private readonly DeliveryPartnerOrderService _orderService;

        public DeliveryPartnerOrdersController(DeliveryPartnerOrderService orderService)
        {
            _orderService = orderService;
        }

        // -----------------------------------------------
        // 🔵 GET: Partner Profile
        // -----------------------------------------------
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var partnerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (partnerIdClaim == null)
                return Unauthorized(new { message = "Invalid or missing partner ID" });

            int partnerId = int.Parse(partnerIdClaim);

            var partner = await _orderService.GetPartnerById(partnerId);

            if (partner == null)
                return NotFound(new { message = "Partner not found" });

            return Ok(new
            {
                partner.Id,
                partner.Name,
                partner.Email,
                partner.PhoneNumber,
                partner.Pincode,
                partner.IsActive,
                partner.MaxActiveOrders,
                partner.Role
            });
        }

        // -----------------------------------------------
        // 🟢 PUT: Update Partner Profile
        // -----------------------------------------------
        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] DeliveryPartnerProfileDto dto)
        {
            var partnerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (partnerIdClaim == null)
                return Unauthorized(new { message = "Invalid partner ID" });

            int partnerId = int.Parse(partnerIdClaim);

            var updatedPartner = await _orderService.UpdateProfile(partnerId, dto);

            return Ok(new
            {
                message = "Profile updated successfully",
                updatedPartner.Id,
                updatedPartner.Name,
                updatedPartner.Email,
                updatedPartner.PhoneNumber,
                updatedPartner.Pincode,
                updatedPartner.MaxActiveOrders
            });
        }

        // -----------------------------------------------
        // GET: Assigned Orders
        // -----------------------------------------------
        [HttpGet("orders")]
        [Authorize]
        public async Task<IActionResult> GetMyOrders()
        {
            var partnerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (partnerIdClaim == null)
                return Unauthorized(new { message = "Invalid or missing partner ID" });

            int partnerId = int.Parse(partnerIdClaim);

            var orders = await _orderService.GetOrdersForPartner(partnerId);

            return Ok(orders);
        }

        // -----------------------------------------------
        // PUT: Update Order Status
        // -----------------------------------------------
        [HttpPut("orders/{orderId}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromQuery] string status)
        {
            var partnerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (partnerIdClaim == null)
                return Unauthorized(new { message = "Invalid partner ID" });

            int partnerId = int.Parse(partnerIdClaim);

            var order = await _orderService.GetOrderForUpdate(orderId, partnerId);

            if (order == null)
                return NotFound(new { message = "Order not found or not assigned to you" });

            order.Status = status;

            await _orderService.SaveOrder(order);

            return Ok(new
            {
                message = "Order status updated successfully",
                status
            });
        }

    }
}
