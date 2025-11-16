using SPDPBWeb.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPDSTApi
{ 
    public class Donation    
    {
        public int DonationId { get; set; }
        public int UserId { get; set; }
        public int? DonatedAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public DateTime? PayDate { get; set; }
        public string? PayMode { get; set; }
        public string? TransactionNo { get; set; }
        public string? DonationType { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool PaymentStatus { get; set; }
        public string? ReceiptType { get; set; }
        public User User { get; set; }
    }
}
