using System.ComponentModel.DataAnnotations;

namespace Training_BE.DTOs
{
    public class ProductUpdateDto
    {
        [Required]
        public int Id { get; set; }  // Product to update

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string Description { get; set; }

        // For image update (optional)
        public IFormFile? ImageFile { get; set; }
        public string? ImageBase64 { get; set; }
    }
}
