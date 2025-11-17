namespace Training_BE.DTOs.DeliveryPartnerDTOs
{
    public class DeliveryPartnerRegisterDto
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Pincode { get; set; }
        public string Password { get; set; }

        public string? Email { get; set; }
    }
}
