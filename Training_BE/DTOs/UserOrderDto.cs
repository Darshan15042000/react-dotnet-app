namespace Training_BE.DTOs
{
    public class UserOrderDto
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string Warranty { get; set; }
        public string Specifications { get; set; }
        public string ImageBase64 { get; set; }
        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }
    }

}
