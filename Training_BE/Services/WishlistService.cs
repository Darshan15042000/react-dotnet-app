using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class WishlistService
    {
        private readonly ApplicationDbContext _db;

        public WishlistService(ApplicationDbContext db)
        {
            _db = db;
        }

        // Add product to wishlist
        public async Task<ProductDto> AddToWishlist(int productId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var existing = await _db.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (existing != null) return ProductService.MapToDto(product);

            _db.Wishlists.Add(new Wishlist { UserId = userId, ProductId = productId });
            await _db.SaveChangesAsync();
            return ProductService.MapToDto(product);
        }

        // Get wishlist items
        public async Task<List<ProductDto>> GetWishlistItems(Guid userId)
        {
            var wishlistItems = await _db.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .ToListAsync();

            return wishlistItems.Select(w => ProductService.MapToDto(w.Product)).ToList();
        }

        // Remove from wishlist
        public async Task<bool> RemoveFromWishlist(int productId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var wishlistItem = await _db.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (wishlistItem == null) return false;

            _db.Wishlists.Remove(wishlistItem);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}

