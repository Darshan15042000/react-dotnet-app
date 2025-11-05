namespace Training_BE.DTOs
{
    public class AddressDto
    {
        public string Name { get; set; }
        public string MobileNumber { get; set; }
        public string AlternatePhone { get; set; }
        public string Pincode { get; set; }
        public string AddressLine { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Landmark { get; set; }
        public bool IsDefault { get; set; }
    }

}
