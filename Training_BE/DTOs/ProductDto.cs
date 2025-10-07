namespace Training_BE.DTOs
{
    public class ProductDto
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }



        //For image upload
        public IFormFile? ImageFile { get; set; }

        public string? ImageBase64 { get; set; }


        // more details fields of product
        public string Category { get; set; }
        public string Brand { get; set; }
        public string Specifications { get; set; }
        public string Warranty { get; set; }



    }
}
