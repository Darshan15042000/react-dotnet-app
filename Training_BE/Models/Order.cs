using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Training_BE.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }

        [Required]
        public int ProductId { get; set; }


        [ForeignKey("ProductId")]
        public Product Product { get; set; } // this is for link the product table with order table 

        [Required]
        public Guid AdminId { get; set; }

        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }

        // New column for Address
        [Required]
        public int AddressId { get; set; }

        [ForeignKey("AddressId")]
        public Address Address { get; set; }  // links to Address table


        // 🔹 New fields for delivery
        public int? DeliveryPartnerId { get; set; }

        [ForeignKey(nameof(DeliveryPartnerId))]
        public DeliveryPartner? DeliveryPartner { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Assigned, Delivered
    }


}


