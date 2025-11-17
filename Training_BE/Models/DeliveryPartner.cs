using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Training_BE.Models
{
    public class DeliveryPartner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(15)]
        public string PhoneNumber { get; set; }

        [Required]
        [MaxLength(10)]
        public string Pincode { get; set; }

        // ⭐ NEW FIELD — email is optional but useful
        [MaxLength(150)]
        public string? Email { get; set; }

        // ⭐ REQUIRED FOR LOGIN
        [Required]
        public string PasswordHash { get; set; }

        // ⭐ OPTIONAL ROLE (makes JWT authorization better)
        public string Role { get; set; } = "DeliveryPartner";

        public bool IsActive { get; set; } = true;

        public int MaxActiveOrders { get; set; } = 10;

        // Association with Orders
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
