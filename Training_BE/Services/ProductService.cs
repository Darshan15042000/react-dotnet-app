using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class ProductService
    {
        // for the interaction with db 
        private readonly ApplicationDbContext _db;
        private readonly ILogger<ProductService> _logger;



        // contructor based dependency injection
        public ProductService(ApplicationDbContext db, ILogger<ProductService> logger)
        {
            _db = db;
            _logger = logger;
        }

        // Map Product to ProductDto
        public static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                Category = product.Category,
                Brand = product.Brand,
                Specifications = product.Specifications,
                Warranty = product.Warranty,
                ImageBase64 = product.Image != null ? Convert.ToBase64String(product.Image) : null
            };
        }


        // Create Product
        public async Task<Product> CreateProduct(ProductDto dto, ClaimsPrincipal user)
        {

            // take the admin id from jwt

            var adminIdClaim = user.Claims.FirstOrDefault(c=>c.Type == "id")?.Value;

            if (adminIdClaim == null)
                throw new UnauthorizedAccessException("Admins Id not founf in jwt token");

            var adminId = Guid.Parse(adminIdClaim);



            // Get admin dretils from claims--- jwt stores info 
            var adminUsername = user.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

            // Log BEFORE adding product
            _logger.LogInformation("Admin {Admin} is attempting to add a product: {ProductName} at {Time}",
                adminUsername, dto.Name, DateTime.UtcNow);

            // convert image if admin provides 
            byte[]? imageBytes = null;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            { 
                using var ms = new MemoryStream();
                await dto.ImageFile.CopyToAsync(ms);
                imageBytes = ms.ToArray();
             
            }
            else if(!string.IsNullOrEmpty(dto.ImageBase64))
            {
                imageBytes = Convert.FromBase64String(dto.ImageBase64);
            }


                var product = new Product
                {
                    Name = dto.Name,
                    Price = dto.Price,
                    Description = dto.Description,
                    Category = dto.Category,        
                    Brand = dto.Brand,             
                    Specifications = dto.Specifications,
                    Warranty = dto.Warranty,
                    Image = imageBytes,
                    CreatedBy = adminId,
                    UpdatedBy = adminId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

           
            // .select

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            // Log AFTER adding product
            _logger.LogInformation("Product {ProductName} added successfully by Admin {Admin} at {Time}",
                dto.Name, adminUsername, DateTime.UtcNow);
            return product;
        }
        // Get All Products 
        public async Task<List<ProductDto>> GetAllProducts()
        {
            var products = await _db.Products.ToListAsync();
            return products.Select(p => MapToDto(p)).ToList();
        }

        // Get Product by Id
        public async Task<ProductDto> GetProductById(int id)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;
            return MapToDto(product);
        }

        // Update Product
        public async Task<Product> UpdateProduct(int id, ProductDto dto, ClaimsPrincipal user)
        {
            // 1 Get admin info from claims

            var adminIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            var adminUsername = user.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

            if (adminIdClaim == null)
                throw new UnauthorizedAccessException("Admin ID not found in JWT token.");

            var adminId = Guid.Parse(adminIdClaim);

            // Log BEFORE Update the product
            _logger.LogInformation("Admin {Admin} is attempting to Updtae a product: {ProductName} at {Time}",
                adminUsername, dto.Name, DateTime.UtcNow);

            // 2  fethc the product
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;

            // 3 only the admin who created can update
            if (product.CreatedBy != adminId)
                throw new UnauthorizedAccessException("You are not allowed to update this product.");


            // 4 update the product details
            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.Category = dto.Category;        
            product.Brand = dto.Brand;              
            product.Specifications = dto.Specifications;
            product.Warranty = dto.Warranty;

            // 5. Update image if provided
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                using var ms = new MemoryStream();
                await dto.ImageFile.CopyToAsync(ms);
                product.Image = ms.ToArray();
            }
            else if (!string.IsNullOrEmpty(dto.ImageBase64))
            {
                product.Image = Convert.FromBase64String(dto.ImageBase64);
            }

            // 6. Update ownership info
            product.UpdatedBy = adminId;
            product.UpdatedAt = DateTime.UtcNow;




            await _db.SaveChangesAsync();

            // Log AFTER adding product
            _logger.LogInformation("Product {ProductName} Updated successfully by Admin {Admin} at {Time}",
                dto.Name, adminUsername, DateTime.UtcNow);

            return product;
        }

        // Delete Product
        public async Task<bool> DeleteProduct(int id, ClaimsPrincipal user)
        {
            var adminIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var adminUsername = user.Claims.FirstOrDefault(c => c.Type == "username")?.Value;

            if (adminIdClaim == null)
                throw new UnauthorizedAccessException("Admin ID not found in JWT token.");

            var adminId = Guid.Parse(adminIdClaim);

            var product = await _db.Products.FindAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Admin {Admin} attempted to delete a non-existing product with ID {ProductId} at {Time}",
                    adminUsername, id, DateTime.UtcNow);
                return false;
            }

            if (product.CreatedBy != adminId)
                throw new UnauthorizedAccessException("You are not allowed to delete this product.");

            // Delete related wishlist items
            var wishlistItems = _db.Wishlists.Where(w => w.ProductId == id);
            _db.Wishlists.RemoveRange(wishlistItems);

            // Delete related cart items
            var cartItems = _db.Carts.Where(c => c.ProductId == id);
            _db.Carts.RemoveRange(cartItems);

            _logger.LogInformation("Admin {Admin} is attempting to delete product: {ProductName} at {Time}",
                adminUsername, product.Name, DateTime.UtcNow);

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Product {ProductName} deleted successfully by Admin {Admin} at {Time}",
                product.Name, adminUsername, DateTime.UtcNow);

            return true;
        }

        // method for serch the product with name like mobile/ laptop
        public async Task<IEnumerable<ProductDto>> SearchProductByName(string name)
        {
            name = name.Trim().ToLower();
            var allProducts = await _db.Products.ToListAsync();
            var filtered = allProducts.Where(p => p.Name.ToLower().Split(' ').Any(word => word == name));
            return filtered.Select(p => MapToDto(p));
        }



        // Add product to wishlist
        public async Task<ProductDto> AddToWishlist(int productId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var existing = await _db.Wishlists.FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
            if (existing != null) return MapToDto(product); // already in wishlist

            _db.Wishlists.Add(new Wishlist { UserId = userId, ProductId = productId });
            await _db.SaveChangesAsync();
            return MapToDto(product);
        }

        public async Task<List<ProductDto>> GetWishlistItems(Guid userId)
        {
            // Step 1: Fetch wishlist + related products from DB
            var wishlistItems = await _db.Wishlists
                .Include(w => w.Product) // Include the related Product
                .Where(w => w.UserId == userId)
                .ToListAsync();          // Fetch into memory

            // Step 2: Map in C# memory
            return wishlistItems.Select(w => MapToDto(w.Product)).ToList();
        }


        // Add product to Cart
        public async Task<CartItemDto> AddToCart(int productId, ClaimsPrincipal user, int quantity)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var existing = await _db.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
            if (existing != null)
            {
                existing.Quantity += quantity;
                await _db.SaveChangesAsync();
            }
            else
            {
                _db.Carts.Add(new Cart { UserId = userId, ProductId = productId, Quantity = quantity });
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
                Quantity = quantity
            };
        }


        // method for get wishlist of user

        public async Task<List<CartItemDto>> GetCartItems(Guid userId)
        {
            return await _db.Carts
                .Where(c => c.UserId == userId)
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
                    Quantity = c.Quantity
                })
                .ToListAsync();
        }


        //method for order the product by user (place order)

        public async Task<Order> PlaceOrder(int productId, int quantity, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var userName = user.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            var userEmail = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            var product = await _db.Products.FindAsync(productId);
            if (product == null) throw new Exception("Product not found");

            var order = new Order
            {
                UserId = userId,
                UserName = userName,
                UserEmail = userEmail,
                ProductId = productId,
                AdminId = product.CreatedBy,   // product owner
                Quantity = quantity,
                OrderDate = DateTime.UtcNow
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return order;
        }


        // method for get the users orders details

        public async Task<List<UserOrderDto>> GetUserOrders(Guid userId)
        {
            return await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Product)
                .Select(o => new UserOrderDto
                {
                    ProductName = o.Product.Name,
                    Description = o.Product.Description,
                    Warranty = o.Product.Warranty,
                    Specifications = o.Product.Specifications,
                    ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                    Quantity = o.Quantity,
                    OrderDate = o.OrderDate
                })
                .ToListAsync();
        }

        //method for admin's product details like who order the product 


        public async Task<List<AdminOrderDto>> GetAdminOrders(Guid adminId)
        {
            return await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Include(o => o.Product)
                .Select(o => new AdminOrderDto
                {
                    UserId = o.UserId,
                    UserName = o.UserName,
                    UserEmail = o.UserEmail,
                    ProductName = o.Product.Name,
                    ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                    Quantity = o.Quantity,
                    OrderDate = o.OrderDate
                })
                .ToListAsync();
        }

        // method for taking the innfo about the admin's customer

        public async Task<List<AdminCustomerDto>> GetAdminCustomers(Guid adminId)
        {
            return await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Select(o => new AdminCustomerDto
                {
                    UserId = o.UserId,
                    UserName = o.UserName,
                    UserEmail = o.UserEmail
                })
                .Distinct()
                .ToListAsync();
        }

        //method for specific customers details with product

        public async Task<List<AdminOrderDto>> GetCustomerOrders(Guid adminId, Guid userId)
        {
            return await _db.Orders
                .Where(o => o.AdminId == adminId && o.UserId == userId)
                .Include(o => o.Product)
                .Select(o => new AdminOrderDto
                {
                    UserId = o.UserId,
                    UserName = o.UserName,
                    UserEmail = o.UserEmail,
                    ProductName = o.Product.Name,
                    ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                    Quantity = o.Quantity,
                    OrderDate = o.OrderDate
                })
                .ToListAsync();
        }









    }
}
