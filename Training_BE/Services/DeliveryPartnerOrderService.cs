using Microsoft.EntityFrameworkCore;
using Training_BE.Data;
using Training_BE.DTOs.DeliveryPartnerDTOs;
using Training_BE.Models;

namespace Training_BE.Services
{
    public class DeliveryPartnerOrderService
    {
        private readonly ApplicationDbContext _db;

        public DeliveryPartnerOrderService(ApplicationDbContext db)
        {
            _db = db;
        }

        // ✅ 1. Get all assigned orders for this partner
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
                Pincode = o.Address.Pincode,
                Status = o.Status   // update status

            }).ToList();
        }

        // ✅ 2. Get specific order for partner (validating ownership)
        public async Task<Order?> GetOrderForUpdate(int orderId, int partnerId)
        {
            return await _db.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.DeliveryPartnerId == partnerId);
        }

        //  Save updated order (status update etc.)
        public async Task SaveOrder(Order order)
        {
            _db.Orders.Update(order);
            await _db.SaveChangesAsync();
        }

        public async Task<DeliveryPartner?> GetPartnerById(int id)
        {
            return await _db.DeliveryPartners.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<DeliveryPartner> UpdateProfile(int id, DeliveryPartnerProfileDto dto)
        {
            var partner = await _db.DeliveryPartners.FirstOrDefaultAsync(p => p.Id == id);

            if (partner == null)
                throw new Exception("Partner not found");

            partner.Name = dto.Name;
            partner.Email = dto.Email;
            partner.PhoneNumber = dto.PhoneNumber;
            partner.Pincode = dto.Pincode;
            partner.MaxActiveOrders = dto.MaxActiveOrders;

            await _db.SaveChangesAsync();
            return partner;
        }

    }
}
