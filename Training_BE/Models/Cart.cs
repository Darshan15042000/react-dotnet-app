using System.ComponentModel.DataAnnotations;

namespace Training_BE.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        public Guid UserId { get; set; }   // Reference to User
        public User User { get; set; }

        public int ProductId { get; set; } // Reference to Product
        public Product Product { get; set; }

        //public int Quantity { get; set; } = 1;

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }

}
