namespace Training_BE.DTOs.DeliveryPartnerDTOs
{
    public class DeliveryPartnerOrderDto
    {
        public int OrderId { get; set; }

        // product details
        public string ProductName { get; set; }
        public string ProductImage { get; set; }

        public string ImageBase64 { get; set; }

        // quantity
        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }

        // customer details
        public Guid UserId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerMobile { get; set; }

        // address
        public string AddressLine { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Pincode { get; set; }
    }
}

