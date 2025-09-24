namespace SPDPBWeb.DTOs
{
    public class UserWithPlantDto
    {
        // User Fields
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public long ContactNumber { get; set; }
        public string Place { get; set; }
        public string Address { get; set; }
        public string Designation { get; set; }
        public string Institution { get; set; }

        // Plant Fields
        public int PlantsNeeded { get; set; }
        public string Variety { get; set; }
        public string DeliveryStatus { get; set; }
    }

}
