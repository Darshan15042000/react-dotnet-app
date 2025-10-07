namespace Training_BE.DTOs
{
    public class AdminOrderDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }

        public string ProductName { get; set; }
        public string ImageBase64 { get; set; }
        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }
    }

}
