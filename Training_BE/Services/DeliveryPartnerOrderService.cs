using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs.DeliveryPartnerDTOs;

namespace Training_BE.Services
{
    public class DeliveryPartnerOrderService
    {
        private readonly ApplicationDbContext _db;

        public DeliveryPartnerOrderService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<DeliveryPartnerOrderDto>> GetOrdersForPartner(int partnerId)
        {
            var orders = await _db.Orders
                .Where(o => o.DeliveryPartnerId == partnerId)
                .Include(o => o.Product)
                .Include(o => o.Address)
                .ToListAsync();

            return orders.Select(o => new DeliveryPartnerOrderDto
            {
                OrderId = o.Id,
                ProductName = o.Product.Name,
                ImageBase64 = o.Product.Image != null ? Convert.ToBase64String(o.Product.Image) : null,
                Quantity = o.Quantity,
                OrderDate = o.OrderDate,

                UserId = o.UserId,
                CustomerName = o.Address.Name,
                CustomerMobile = o.Address.MobileNumber,

                AddressLine = o.Address.AddressLine,
                City = o.Address.City,
                State = o.Address.State,
                Pincode = o.Address.Pincode

            }).ToList();
        }
    }
}

