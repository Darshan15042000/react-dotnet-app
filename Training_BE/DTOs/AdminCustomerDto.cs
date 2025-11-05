namespace Training_BE.DTOs
{
    public class AdminCustomerDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }


        public int ProductId { get; set; }       // new
        public string ProductName { get; set; }  // new
    }

}
