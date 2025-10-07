using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs;
using Training_BE.Services;

namespace Training_BE.Controllers
{
    [Route("api/[controller]")]  
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductController(ProductService service)
        {
            _service = service;
        }



        [HttpPost]
        [Authorize(Roles = "Admin")] // Only Admin can create
        public async Task<IActionResult> Create([FromForm]ProductDto dto)
        {
            var user = HttpContext.User;
            var product = await _service.CreateProduct(dto,user);
            return Ok(product);
        }
        [HttpGet]
        [Authorize] // Any logged-in user
        public async Task<IActionResult> GetAll()
        {
            var products = await _service.GetAllProducts();
            return Ok(products);
        }

        [HttpGet("{id}")]
        [AllowAnonymous] // <-- anyone can access
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _service.GetProductById(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromForm] ProductDto dto)
        {
            var user = HttpContext.User;

            try
            {
                var product = await _service.UpdateProduct(id, dto, user);

                if (product == null)
                    return NotFound(new { message = "Product not found" });

                return Ok(product);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message }); // <-- now frontend receives 401
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only Admin can delete
        public async Task<IActionResult> Delete(int id)
        {
            var user = HttpContext.User;

            try
            {
                var deleted = await _service.DeleteProduct(id, user);

                if(!deleted)
                    return NotFound();

                return Ok(new { message = "Product deleted successfully" });
            }
            catch(UnauthorizedAccessException e)
            {
                return Unauthorized(new {message = e.Message }); // 401 for frntend so i can print msg that ur not authorized to delete
            }


            
        }


        // APi for testing the exception
        [HttpGet("test_error")]

        public IActionResult TestError()
        {
            throw new Exception("this api for testing the exception");
        }



        // product search by name 
        [HttpGet("search/{name}")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchProducts(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Search term cannot be empty");

            var products = await _service.SearchProductByName(name);

            if (!products.Any())
                return NotFound("No products found");

            var result = products.Select(p => new
            {
                id = p.Id,
                name = p.Name,
                price = p.Price,
                description = p.Description,
                category = p.Category,
                brand = p.Brand,
                specifications = p.Specifications,
                warranty = p.Warranty,
                imageBase64 = p.ImageBase64 // <-- use ImageBase64 from ProductDto
            });


            return Ok(result);
        }




        // only loggged in users have accesse to add product in cart or wishlist
        [HttpPost("wishlist/{productId}")]
        [Authorize(Roles = "User,Admin")] // user and admin both
        public async Task<IActionResult> AddToWishlist(int productId)
        {
            try
            {
                var wishlist = await _service.AddToWishlist(productId, HttpContext.User);
                return Ok(wishlist);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // get the wishlist of user 

        [HttpGet("wishlist")]
        [Authorize]
        public async Task<IActionResult> GetWishlist()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var wishlistItems = await _service.GetWishlistItems(userId);
            return Ok(wishlistItems);
        }



        [HttpPost("cart/{productId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> AddToCart(int productId, [FromQuery] int quantity = 1)
        {
            try
            {
                var cart = await _service.AddToCart(productId, HttpContext.User, quantity);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // controller for wishlist products


        // controller for geting cart products

        [HttpGet("cart")]
        [Authorize]
        public async Task<IActionResult> GetCart()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var cartItems = await _service.GetCartItems(userId);
            return Ok(cartItems);
        }


        // Place an order (User)
        [HttpPost("order/{productId}")]
        [Authorize(Roles = "User,Admin")] // both can order
        public async Task<IActionResult> PlaceOrder(int productId, [FromQuery] int quantity = 1)
        {
            try
            {
                var order = await _service.PlaceOrder(productId, quantity, HttpContext.User);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        // Get all orders of logged-in User
        [HttpGet("orders/user")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var orders = await _service.GetUserOrders(userId);
            return Ok(orders);
        }


        // Get all orders for Admin (products owned by admin)
        [HttpGet("orders/admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminOrders()
        {
            var adminId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var orders = await _service.GetAdminOrders(adminId);
            return Ok(orders);
        }


        // controller method  for get the user of admis products

        
        [HttpGet("orders/admin/customers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminCustomers()
        {
            var adminId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var customers = await _service.GetAdminCustomers(adminId);
            return Ok(customers);
        }


        // controller method for getting the specific customers order details

        [HttpGet("orders/admin/customer-orders/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCustomerOrders(Guid userId)
        {
            var adminId = Guid.Parse(User.Claims.First(c => c.Type == "id").Value);
            var orders = await _service.GetCustomerOrders(adminId, userId);
            return Ok(orders);
        }







    }
}
