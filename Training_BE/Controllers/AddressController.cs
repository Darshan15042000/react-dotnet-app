using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Training_BE.DTOs;
using Training_BE.Models;
using Training_BE.Services;
using System.Security.Claims;

namespace Training_BE.Controllers
{
   





    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly AddressService _service;

        public AddressController(AddressService service)
        {
            _service = service;
        }

        // 1️⃣ Add a new address
        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> AddAddress([FromBody] AddressDto dto)
        {
            try
            {
                var user = HttpContext.User;
                var address = await _service.AddAddress(dto, user);
                return Ok(address);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 2️⃣ Get all addresses for logged-in user
        [HttpGet]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetAddresses()
        {
            try
            {
                var user = HttpContext.User;
                var addresses = await _service.GetAddresses(user);
                return Ok(addresses);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message }); 
            }
        }

        // 3️⃣ Update an address
        [HttpPut("{addressId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> UpdateAddress(int addressId, [FromBody] AddressDto dto)
        {
            try
            {
                var user = HttpContext.User;
                var updatedAddress = await _service.UpdateAddress(addressId, dto, user);
                return Ok(updatedAddress);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 4️⃣ Delete an address
        [HttpDelete("{addressId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> DeleteAddress(int addressId)
        {
            try
            {
                var user = HttpContext.User;
                var deleted = await _service.DeleteAddress(addressId, user);
                if (!deleted)
                    return NotFound(new { message = "Address not found" });

                return Ok(new { message = "Address deleted successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetAddressById(int id)
        {
            var address = await _service.GetAddressById(id);
            if (address == null)
                return NotFound(new { Message = "Address not found" });

            return Ok(address);
        }

        // ✅ Get Default Address of Logged-In User
        [HttpGet("default")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetDefaultAddress()
        {
            try
            {
                var defaultAddress = await _service.GetDefaultAddressAsync(User);
                if (defaultAddress == null)
                    return NotFound(new { Message = "No default address found for this user" });

                return Ok(defaultAddress);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal Server Error", Detail = ex.Message });
            }
        }

    }
}

