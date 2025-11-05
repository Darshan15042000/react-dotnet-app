using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Training_BE.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }  // Primary Key

        [Required]
        public Guid UserId { get; set; }  // Foreign Key to User

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(15)]
        public string MobileNumber { get; set; }

        [MaxLength(15)]
        public string AlternatePhone { get; set; }

        [Required]
        [MaxLength(10)]
        public string Pincode { get; set; }

        [Required]
        [MaxLength(255)]
        public string AddressLine { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        [Required]
        [MaxLength(100)]
        public string State { get; set; }

        [MaxLength(150)]
        public string Landmark { get; set; }

        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}

