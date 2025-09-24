namespace SPDPBWeb.Models
{
    public class UserDonationsDto
    {
        public int UserId { get; set; }
        public string? NameEn { get; set; }
        public string? NameKn { get; set; }
        public string? Place { get; set; }
        public string? ContactNo { get; set; }
        public int? PledgeAmount { get; set; }
        public int TotalDonatedAmount { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
        public List<DonationDto>? Donations { get; set; }
    }
}
