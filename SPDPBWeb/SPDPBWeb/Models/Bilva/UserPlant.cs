using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SPDPBWeb.Models.Bilva
{
    [Table("userplants", Schema = "public")]
    public class UserPlant
    {
        [Key]
        [Column("userplantid")]
        public int UserPlantId { get; set; }

        [ForeignKey("BilvaUser")]
        [Column("userid")]
        public int UserId { get; set; }

        [Column("plantsneeded")]
        public int PlantsNeeded { get; set; }

        [Column("variety")]
        [MaxLength(20)]
        public string Variety { get; set; }

        [Column("deliverystatus")]
        [MaxLength(20)]
        public string DeliveryStatus { get; set; }

        public BilvaUser BilvaUser { get; set; }
    }

}
