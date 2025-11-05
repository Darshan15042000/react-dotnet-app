using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs;
using Training_BE.Services;

namespace Training_BE.Controllers
{
    [ApiController]
    [Route("api/Product")]
    public class CartController : ControllerBase
    {
        private readonly CartService _service;

        public CartController(CartService service)
        {
            _service = service;
        }

        // Add to cart
        [HttpPost("cart/{productId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> AddToCart(int productId/*, [FromQuery] int quantity = 1*/)
        {
            try
            {
                var cart = await _service.AddToCart(productId, HttpContext.User/*, quantity*/);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get cart items
        [HttpGet("cart")]
        [Authorize]
        public async Task<IActionResult> GetCart()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var cartItems = await _service.GetCartItems(userId);
            return Ok(cartItems);
        }

        // Remove from cart
        [HttpDelete("cart/{productId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            try
            {
                var removed = await _service.RemoveFromCart(productId, HttpContext.User);
                if (!removed) return NotFound(new { message = "Cart item not found" });
                return Ok(new { message = "Item removed from cart" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

