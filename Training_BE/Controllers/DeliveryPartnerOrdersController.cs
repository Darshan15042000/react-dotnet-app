using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        // 🟦 GET: api/deliverypartner/orders
        [HttpGet("orders")]
        [Authorize]  // Delivery partner must be logged in
        public async Task<IActionResult> GetMyOrders()
        {
            var partnerIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (partnerIdClaim == null)
                return Unauthorized(new { message = "Invalid or missing partner ID" });

            int partnerId = int.Parse(partnerIdClaim);

            var orders = await _orderService.GetOrdersForPartner(partnerId);

            return Ok(orders);
        }
    }
}
