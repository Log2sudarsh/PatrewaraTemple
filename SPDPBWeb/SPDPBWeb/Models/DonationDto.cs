namespace SPDPBWeb.Models
{
    public class DonationDto
    {
        public int DonationId { get; set; }
        public int UserId { get; set; }
        public int? DonatedAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public DateTime? PayDate { get; set; }
        public string? PayMode { get; set; }
        public bool? PaymentStatus { get; set; }
        public string? TransactionNo { get; set; }
        public string? ReceiptType { get; set; }
        public string? DonationType { get; set; }

        public string? NameKn { get; set; }
        public string? NameEn { get; set; }
        public string? Place { get; set; }
        public string? ContactNo { get; set; }

        public required string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
