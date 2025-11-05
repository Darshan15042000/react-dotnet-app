using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class CartService
    {
        private readonly ApplicationDbContext _db;

        public CartService(ApplicationDbContext db)
        {
            _db = db;
        }

        // Add product to cart
        public async Task<CartItemDto> AddToCart(int productId, ClaimsPrincipal user /*, int quantity*/)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var existing = await _db.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
            if (existing != null)
            {
                //existing.Quantity += quantity;
                //await _db.SaveChangesAsync();
                throw new Exception("Product already in cart");
            }
            else
            {
                _db.Carts.Add(new Cart { UserId = userId, ProductId = productId /*, Quantity = quantity*/ });
                await _db.SaveChangesAsync();
            }

            return new CartItemDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                Category = product.Category,
                Brand = product.Brand,
                Specifications = product.Specifications,
                Warranty = product.Warranty,
                ImageBase64 = product.Image != null ? Convert.ToBase64String(product.Image) : null,
                //Quantity = quantity
            };
        }

        // Get all cart items for a user
        public async Task<List<CartItemDto>> GetCartItems(Guid userId)
        {
            return await _db.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .Select(c => new CartItemDto
                {
                    Id = c.Product.Id,
                    Name = c.Product.Name,
                    Price = c.Product.Price,
                    Description = c.Product.Description,
                    Category = c.Product.Category,
                    Brand = c.Product.Brand,
                    Specifications = c.Product.Specifications,
                    Warranty = c.Product.Warranty,
                    ImageBase64 = c.Product.Image != null ? Convert.ToBase64String(c.Product.Image) : null,
                    Quantity = c.Product.Quantity,
                })
                .ToListAsync();
        }

        // Remove item from cart
        public async Task<bool> RemoveFromCart(int productId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var cartItem = await _db.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (cartItem == null) return false;

            _db.Carts.Remove(cartItem);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}

