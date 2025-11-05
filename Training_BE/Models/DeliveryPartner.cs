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
        public string Pincode { get; set; } // Service area

        public bool IsActive { get; set; } = true;

        public int MaxActiveOrders { get; set; } = 10; // optional load control

        // 🔹 One-to-many relationship
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}

