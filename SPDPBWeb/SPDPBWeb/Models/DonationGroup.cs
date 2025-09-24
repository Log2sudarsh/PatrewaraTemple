using SPDSTApi;

namespace SPDPBWeb.Models
{
    public class DonationGroup
    {
        public int UserId { get; set; }
        public List<Donation>? Donations { get; set; }
        public int TotalDonatedAmount { get; set; }
    }
}
