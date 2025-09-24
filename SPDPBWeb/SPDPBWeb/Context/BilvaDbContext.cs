using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Models.Bilva;


namespace SPDPBWeb.Context
{
     public class BilvaDbContext : DbContext
    {
        public BilvaDbContext(DbContextOptions<BilvaDbContext> options) : base(options) { }

        public DbSet<BilvaUser> BilvaUsers { get; set; }
        public DbSet<UserPlant> UserPlants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("public"); 

            modelBuilder.Entity<BilvaUser>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<UserPlant>()
                .HasKey(p => p.UserPlantId);

            modelBuilder.Entity<UserPlant>()
                .HasOne(p => p.BilvaUser)
                .WithMany(u => u.UserPlants)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
