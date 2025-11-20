namespace Training_BE.DTOs.DeliveryPartnerDTOs
{
    public class DeliveryPartnerProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Pincode { get; set; }
        public int MaxActiveOrders { get; set; }
        public bool IsActive { get; set; }
    }
}
