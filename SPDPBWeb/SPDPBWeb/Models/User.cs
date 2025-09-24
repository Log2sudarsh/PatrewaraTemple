using SPDSTApi;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPDPBWeb.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string NameEn { get; set; }
        public string NameKn { get; set; }
        public string? Place { get; set; }
        public string? ContactNo { get; set; }
        public int? PledgeAmount { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? UserType { get; set; }
        public ICollection<Donation>? Donations { get; set; }
    }
}
