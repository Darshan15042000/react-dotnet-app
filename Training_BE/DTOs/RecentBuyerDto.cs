namespace Training_BE.DTOs
{
    public class RecentBuyerDto
    {
        public int OrderId { get; set; }
        public string BuyerName { get; set; }
        public string ProductName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
    }

}
