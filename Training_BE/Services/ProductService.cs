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
                ImageBase64 = product.Image != null ? Convert.ToBase64String(product.Image) : null,
                CreatedAt = product.CreatedAt,
                Quantity = product.Quantity
            };
        }


        //  1st Create Product
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
                UpdatedAt = DateTime.UtcNow,
                // NEW: Add stock quantity
                Quantity = dto.Quantity
            };

           
            // .select

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            // Log AFTER adding product
            _logger.LogInformation("Product {ProductName} added successfully by Admin {Admin} at {Time}",
                dto.Name, adminUsername, DateTime.UtcNow);
            return product;
        }
        // 2nd Get All Products 
        public async Task<List<ProductDto>> GetAllProducts()
        {
            var products = await _db.Products.ToListAsync();
            return products.Select(p => MapToDto(p)).ToList();
        }

        //  3rd Get Product by Id
        public async Task<ProductDto> GetProductById(int id)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null;
            return MapToDto(product);
        }

        // 4th Update Product
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

            // NEW: Update stock quantity
            product.Quantity = dto.Quantity;

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

        //-------------------- 5th Delete Product ------------------------------
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

        // 6th--------- method for serch the product with name like mobile/ laptop ----------
        public async Task<IEnumerable<ProductDto>> SearchProductByName(string text)
        {
            text = text.Trim().ToLower();

            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var allProducts = await _db.Products.ToListAsync();

            var filtered = allProducts.Where(p =>
            {
                var haystack = $"{p.Name} {p.Description} {p.Brand}".ToLower();

                return words.Any(word => haystack.Contains(word));
            });

            return filtered.Select(p => MapToDto(p));
        }



        // new method for fast search

        public async Task<List<SearchSuggestionDto>> GetProductSuggestions(string term)
        {
            term = term.Trim().ToLower();

            var products = await _db.Products.ToListAsync();

            var suggestions = products
                .Where(p =>
                    p.Name.ToLower().Contains(term) ||
                    p.Description.ToLower().Contains(term) ||
                    p.Brand.ToLower().Contains(term)
                )
                .Select(p => new SearchSuggestionDto
                {
                    Label = $"{p.Name} - {p.Description}",
                    Value = ExtractSearchText(p)
                })
                .DistinctBy(x => x.Value)
                .Take(8)
                .ToList();

            return suggestions;
        }

        private string ExtractSearchText(Product p)
        {
            var text = $"{p.Brand} {p.Description}".ToLower();

            // remove junk words
            var junk = new[] { "gb", "ram", "(", ")", ",", "-", "blue", "black" };

            foreach (var j in junk)
                text = text.Replace(j, "");

            return string.Join(" ", text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2));
        }
 







        // 7th --------------- Add product to wishlist ---------------------



        //// 9th -------------------- Add product to Cart ----------------------------
        //public async Task<CartItemDto> AddToCart(int productId, ClaimsPrincipal user, int quantity)
        //{
        //    var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
        //    var product = await _db.Products.FindAsync(productId);
        //    if (product == null) throw new Exception("Product not found");

        //    var existing = await _db.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
        //    if (existing != null)
        //    {
        //        existing.Quantity += quantity;
        //        await _db.SaveChangesAsync();
        //    }
        //    else
        //    {
        //        _db.Carts.Add(new Cart { UserId = userId, ProductId = productId, Quantity = quantity });
        //        await _db.SaveChangesAsync();
        //    }

        //    return new CartItemDto
        //    {
        //        Id = product.Id,
        //        Name = product.Name,
        //        Price = product.Price,
        //        Description = product.Description,
        //        Category = product.Category,
        //        Brand = product.Brand,
        //        Specifications = product.Specifications,
        //        Warranty = product.Warranty,
        //        ImageBase64 = product.Image != null ? Convert.ToBase64String(product.Image) : null,
        //        Quantity = quantity
        //    };
        //}


        //// method for get cart of user
        ////10th -------------------------------------------------------------------------------
        //public async Task<List<CartItemDto>> GetCartItems(Guid userId)
        //{
        //    return await _db.Carts
        //        .Where(c => c.UserId == userId)
        //        .Select(c => new CartItemDto
        //        {
        //            Id = c.Product.Id,
        //            Name = c.Product.Name,
        //            Price = c.Product.Price,
        //            Description = c.Product.Description,
        //            Category = c.Product.Category,
        //            Brand = c.Product.Brand,
        //            Specifications = c.Product.Specifications,
        //            Warranty = c.Product.Warranty,
        //            ImageBase64 = c.Product.Image != null ? Convert.ToBase64String(c.Product.Image) : null,
        //            Quantity = c.Product.Quantity,
        //        })
        //        .ToListAsync();
        //}


        //method for order the product by user (place order)
        //11th -----------------------------------------------------------------------------

        public async Task<Order> PlaceOrder(int productId, int quantity, int addressId, ClaimsPrincipal user)
        {
            var userId = Guid.Parse(user.Claims.First(c => c.Type == "id").Value);
            var userName = user.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            var userEmail = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            var product = await _db.Products.FindAsync(productId);
            if (product == null)
                throw new Exception("Product not found");

            if (product.Quantity < quantity)
                throw new Exception($"Only {product.Quantity} item(s) available in stock.");

            // reduce quantity
            product.Quantity -= quantity;

            // Check that the address belongs to this user
            var address = await _db.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
                throw new Exception("Invalid address or address not found.");

            //  Find available delivery partner by pincode
            var deliveryPartner = await _db.DeliveryPartners
                .Include(dp => dp.Orders)
                .Where(dp => dp.Pincode == address.Pincode)
                .OrderBy(dp => dp.Orders.Count)   // ✔ assigns least busy partner
                .FirstOrDefaultAsync();

            if (deliveryPartner == null)
                throw new Exception("No delivery partner available for this pincode.");

            //  Create and assign order
            var order = new Order
            {
                UserId = userId,
                UserName = userName,
                UserEmail = userEmail,
                ProductId = productId,
                AdminId = product.CreatedBy,
                Quantity = quantity,
                OrderDate = DateTime.UtcNow,
                AddressId = address.Id,
                DeliveryPartnerId = deliveryPartner.Id,   // ⭐ assigned partner!
                Status = "Assigned"
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return order;
        }






        // method for get the users orders details
        //12th --------------------------- || --------------------------------------------
        public async Task<List<UserOrderDto>> GetUserOrders(Guid userId)
        {
            return await _db.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Product)
                .Include(o => o.Address) // include Address
                .Select(o => new UserOrderDto
                {
                    ProductName = o.Product.Name,
                    Description = o.Product.Description,
                    Warranty = o.Product.Warranty,
                    Specifications = o.Product.Specifications,
                    ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                    Quantity = o.Quantity,
                    OrderDate = o.OrderDate,

                    // 🆕 Address details
                    MobileNumber = o.Address.MobileNumber,
                    Pincode = o.Address.Pincode,
                    AddressLine = o.Address.AddressLine,
                    City = o.Address.City,
                    State = o.Address.State,
                    Landmark = o.Address.Landmark
                })
                .ToListAsync();
        }

        //method for admin's product details like who order the product 

        //13 --------------------------------- || ----------------------------------------

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
                    ProductId = o.Product.Id.ToString(),
                    ProductBrand = o.Product.Brand,
                    ProductPrice = o.Product.Price.ToString(),
                    ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                    Quantity = o.Quantity,
                    OrderDate = o.OrderDate
                })
                .ToListAsync();
        }

        // method for taking the innfo about the admin's customer
        //14th ----------------------------------- || -----------------------------------------
        public async Task<List<AdminCustomerDto>> GetAdminCustomers(Guid adminId)
        {
            return await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Select(o => new AdminCustomerDto
                {
                    UserId = o.UserId,
                    UserName = o.UserName,
                    UserEmail = o.UserEmail,
                    ProductId = o.ProductId,
                    ProductName = o.Product.Name
                })
                .Distinct()
                .ToListAsync();
        }

        //method for specific customers details with product
        //16th ------------------------------- || ------------------------------------------
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




        // 17th ------------------ admin dashboard --------------------------
        public async Task<AdminDashboardStatsDto> GetAdminDashboardStats(Guid adminId)
        {
            // total users who ordered from this admin
            var totalUsers = await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Select(o => o.UserId)
                .Distinct()
                .CountAsync();

            // total products added by this admin
            var totalProducts = await _db.Products
                .CountAsync(p => p.CreatedBy == adminId);

            // total orders for this admin’s products
            var totalOrders = await _db.Orders
                .CountAsync(o => o.AdminId == adminId);

            // revenue = sum of (product price * quantity)
            var totalRevenue = await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Join(_db.Products,
                      order => order.ProductId,
                      product => product.Id,
                      (order, product) => product.Price * order.Quantity)
                .SumAsync();

            return new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue
            };
        }

        // 18th --------- Get recent buyers for admin's products --------------------------
        public async Task<List<RecentBuyerDto>> GetRecentBuyers(Guid adminId, int limit = 5)
        {
            return await _db.Orders
                .Where(o => o.AdminId == adminId)
                .Include(o => o.Product)
                .OrderByDescending(o => o.OrderDate) // recent first
                .Take(limit) // limit number of results
                .Select(o => new RecentBuyerDto
                {
                    OrderId = o.Id,
                    BuyerName = o.UserName,
                    ProductName = o.Product.Name,
                    OrderDate = o.OrderDate,
                    Status = "Pending" // or your status property if exists
                })
                .ToListAsync();
        }


        //19th ----------- get adminsprodcut only ------------------------- 

        
        public async Task<List<ProductDto>> GetProductsByAdmin(Guid adminId)
        {
            var products = await _db.Products
                .Where(p => p.CreatedBy == adminId)
                .ToListAsync();

            return products.Select(p => MapToDto(p)).ToList();
        }

    }
}
