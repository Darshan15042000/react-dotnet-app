using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class AddressService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<AddressService> _logger;

        public AddressService(ApplicationDbContext db, ILogger<AddressService> logger)
        {
            _db = db;
            _logger = logger;
        }

        // 1️⃣ Add a new address for the logged-in user
        public async Task<Address> AddAddress(AddressDto dto, ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in JWT token");

            var userId = Guid.Parse(userIdClaim);

            // If user wants this address as default, unset previous default
            if (dto.IsDefault)
            {
                var existingDefaults = await _db.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var addr in existingDefaults)
                {
                    addr.IsDefault = false;
                }
            }

            var address = new Address
            {
                UserId = userId,
                Name = dto.Name,
                MobileNumber = dto.MobileNumber,
                AlternatePhone = dto.AlternatePhone,
                Pincode = dto.Pincode,
                AddressLine = dto.AddressLine,
                City = dto.City,
                State = dto.State,
                Landmark = dto.Landmark,
                IsDefault = dto.IsDefault
            };

            _db.Addresses.Add(address);
            await _db.SaveChangesAsync();

            _logger.LogInformation("User {UserId} added a new address at {Time}", userId, DateTime.UtcNow);

            return address;
        }

        // get the address of users 

        public async Task<List<Address>> GetAddresses(ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in JWT token");

            var userId = Guid.Parse(userIdClaim);

            var addresses = await _db.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault) // default address comes first
                .ToListAsync();

            return addresses;
        }


        // update the address of users
        public async Task<Address> UpdateAddress(int addressId, AddressDto dto, ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in JWT token");

            var userId = Guid.Parse(userIdClaim);

            var address = await _db.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
            if (address == null)
                throw new Exception("Address not found");

            // If this address is now default, unset previous default
            if (dto.IsDefault)
            {
                var existingDefaults = await _db.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var addr in existingDefaults)
                {
                    addr.IsDefault = false;
                }
            }

            address.Name = dto.Name;
            address.MobileNumber = dto.MobileNumber;
            address.AlternatePhone = dto.AlternatePhone;
            address.Pincode = dto.Pincode;
            address.AddressLine = dto.AddressLine;
            address.City = dto.City;
            address.State = dto.State;
            address.Landmark = dto.Landmark;
            address.IsDefault = dto.IsDefault;

            await _db.SaveChangesAsync();

            _logger.LogInformation("User {UserId} updated address {AddressId} at {Time}", userId, addressId, DateTime.UtcNow);

            return address;
        }

        //delere the address of users 

        public async Task<bool> DeleteAddress(int addressId, ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in JWT token");

            var userId = Guid.Parse(userIdClaim);

            var address = await _db.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
            if (address == null)
                return false;

            _db.Addresses.Remove(address);
            await _db.SaveChangesAsync();

            _logger.LogInformation("User {UserId} deleted address {AddressId} at {Time}", userId, addressId, DateTime.UtcNow);

            return true;
        }
        public async Task<Address> GetAddressById(int id)
        {
            return await _db.Addresses.FirstOrDefaultAsync(a => a.Id == id);
        }
        //  Get default address for logged-in user
        public async Task<Address> GetDefaultAddressAsync(ClaimsPrincipal user)
        {
            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in JWT token");

            var userId = Guid.Parse(userIdClaim);

            var defaultAddress = await _db.Addresses
                .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault);

            if (defaultAddress != null)
            {
                _logger.LogInformation("Fetched default address for user {UserId}", userId);
            }
            else
            {
                _logger.LogWarning("No default address found for user {UserId}", userId);
            }

            return defaultAddress;
        }



    }
}
