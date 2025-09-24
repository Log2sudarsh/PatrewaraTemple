using Microsoft.EntityFrameworkCore;
using SPDPBWeb.Models;
using SPDSTApi;

namespace SPDPBWeb.Context
{
    public class DonationsContext : DbContext
    {
        public DonationsContext(DbContextOptions<DonationsContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Donation> Donations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Users Table
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId)
                      .HasColumnName("user_id")
                      .UseIdentityColumn(8, 1);

                entity.Property(e => e.NameEn)
                      .HasColumnName("name_en")
                      .HasMaxLength(200);

                entity.Property(e => e.NameKn)
                      .HasColumnName("name_kn")
                      .HasMaxLength(200);

                entity.Property(e => e.Place)
                      .HasColumnName("place")
                      .HasMaxLength(200);

                entity.Property(e => e.ContactNo)
                      .HasColumnName("contact_no")
                      .HasMaxLength(20);

                entity.Property(e => e.PledgeAmount)
                      .HasColumnName("pledge_amount");

                entity.Property(e => e.CreatedBy)
                      .HasColumnName("created_by")
                      .HasMaxLength(100);

                entity.Property(e => e.CreatedOn)
                      .HasColumnName("created_on")
                      .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.ModifiedBy)
                      .HasColumnName("modified_by")
                      .HasMaxLength(100);

                entity.Property(e => e.ModifiedOn)
                      .HasColumnName("modified_on");

                entity.Property(e => e.UserType)
                      .HasColumnName("user_type");
            });

            // Donations Table
            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("Donations");

                entity.HasKey(e => e.DonationId);

                entity.Property(e => e.DonationId)
                      .HasColumnName("donation_id")
                      .UseIdentityColumn(8, 1);

                entity.Property(e => e.UserId)
                      .HasColumnName("user_id");

                entity.Property(e => e.DonatedAmount)
                      .HasColumnName("donated_amount");

                entity.Property(e => e.ReceiptNo)
                      .HasColumnName("receipt_no")
                      .HasMaxLength(50);

                entity.Property(e => e.PayDate)
                      .HasColumnName("pay_date");

                entity.Property(e => e.PayMode)
                      .HasColumnName("pay_mode")
                      .HasMaxLength(50);

                entity.Property(e => e.TransactionNo)
                      .HasColumnName("transaction_no")
                      .HasMaxLength(100);

                entity.Property(e => e.CreatedBy)
                      .HasColumnName("created_by")
                      .HasMaxLength(100);

                entity.Property(e => e.CreatedOn)
                      .HasColumnName("created_on")
                      .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.ModifiedBy)
                      .HasColumnName("modified_by")
                      .HasMaxLength(100);

                entity.Property(e => e.ModifiedOn)
                      .HasColumnName("modified_on");

                entity.Property(e => e.PaymentStatus)
                      .HasColumnName("payment_status");

                entity.Property(e => e.ReceiptType)
                .HasColumnName("receipt_type");

                // Relationship
                entity.HasOne(d => d.User)
                      .WithMany(u => u.Donations)
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
