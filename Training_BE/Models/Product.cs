using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Training_BE.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string Description { get; set; }

        // Store image as binary (BLOB)
        public byte[]? Image { get; set; }

        // Track which admin created the product
        [Required]
        public Guid CreatedBy { get; set; }

        // Track which admin last updated the product
        public Guid? UpdatedBy { get; set; }

        public DateTime CreatedAt        // Track timestamps
 { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (optional)
        [ForeignKey("CreatedBy")]
        public User Creator { get; set; }

        [ForeignKey("UpdatedBy")]
        public User Updater { get; set; }



        // new details of product

        public string Category { get; set; }
        
        public string Brand { get; set; }

        public string Specifications { get; set; }  // JSON string or text
        public string Warranty { get; set; }


        // ✅ New field for stock management
        [Required]
        public int Quantity { get; set; } = 0;

    }
}

