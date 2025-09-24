using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SPDPBWeb.Models.Bilva
{
    [Table("bilvausers", Schema = "public")]
    public class BilvaUser
    {
        [Key]
        [Column("userid")]
        public int UserId { get; set; }

        [Column("firstname")]
        [MaxLength(80)]
        public string FirstName { get; set; }

        [Column("lastname")]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Column("gender")]
        [MaxLength(5)]
        public string Gender { get; set; }

        [Column("contactnumber")]
        public long ContactNumber { get; set; }

        [Column("place")]
        [MaxLength(50)]
        public string Place { get; set; }

        [Column("address")]
        [MaxLength(300)]
        public string Address { get; set; }

        [Column("designation")]
        [MaxLength(20)]
        public string Designation { get; set; }

        [Column("institution")]
        [MaxLength(150)]
        public string Institution { get; set; }

        public ICollection<UserPlant> UserPlants { get; set; }
    }

}
