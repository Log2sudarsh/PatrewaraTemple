namespace SPDPBWeb.Models
{
    public class DonationDto
    {
        public int DonationId { get; set; }
        public int User_Id { get; set; }
        public int? DonatedAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public DateTime? PayDate { get; set; }
        public string? PayMode { get; set; }
        public bool? PaymentStatus { get; set; }
        public string? TransactionNo { get; set; }
        public string? ReceiptType { get; set; }
        public required string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
