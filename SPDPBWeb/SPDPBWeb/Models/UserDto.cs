namespace SPDPBWeb.Models
{
    public class UserDto
    {
        public required string NameKn { get; set; }
        public required string NameEn { get; set; }
        public string? Place { get; set; }
        public string ContactNo { get; set; }
        public int? PledgeAmount { get; set; }
        public required string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
