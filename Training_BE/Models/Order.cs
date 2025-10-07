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
        public Product Product { get; set; }

        [Required]
        public Guid AdminId { get; set; }

        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }
    }


}


