using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Training_BE.DTOs;
using Training_BE.Services;

namespace Training_BE.Controllers
{
    [ApiController]
    [Route("api/Product")] // keeping your previous route base
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // ----------------- Add product to wishlist -----------------
        // POST api/Product/wishlist/{productId}
        [HttpPost("wishlist/{productId}")]
        [Authorize]
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            try
            {
                var product = await _wishlistService.AddToWishlist(productId, User);
                return Ok(product);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ----------------- Get wishlist items -----------------
        // GET api/Product/wishlist
        [HttpGet("wishlist")]
        [Authorize]
        public async Task<IActionResult> GetWishlist()
        {
            try
            {
                var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
                var items = await _wishlistService.GetWishlistItems(userId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ----------------- Remove product from wishlist -----------------
        // DELETE api/Product/wishlist/{productId}
        [HttpDelete("wishlist/{productId}")]
        [Authorize]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            try
            {
                var removed = await _wishlistService.RemoveFromWishlist(productId, User);
                if (!removed) return NotFound(new { message = "Item not found in wishlist" });

                return Ok(new { message = "Item removed from wishlist" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

