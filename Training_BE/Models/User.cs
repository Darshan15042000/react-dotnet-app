using System.ComponentModel.DataAnnotations;

namespace Training_BE.Models
{
    public class User
    {
        
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        // simple role string for now ("Admin", "Cashier", "User")
        public string Role { get; set; } = "User";

        
    }

}
