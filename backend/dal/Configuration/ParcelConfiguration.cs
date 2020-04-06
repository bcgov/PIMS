using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelConfiguration class, provides a way to configure parcels in the database.
    ///</summary>
    public class ParcelConfiguration : BaseEntityConfiguration<Parcel>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Parcel> builder)
        {
            builder.ToTable("Parcels");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.PID).IsRequired();
            builder.Property(m => m.Description).HasMaxLength(2000);
            builder.Property(m => m.Latitude).IsRequired();
            builder.Property(m => m.Longitude).IsRequired();
            builder.Property(m => m.Zoning).HasMaxLength(500);
            builder.Property(m => m.ZoningPotential).HasMaxLength(500);
            builder.Property(m => m.LandLegalDescription).HasMaxLength(500);
            builder.Property(m => m.IsSensitive).HasDefaultValue(false);

            builder.HasOne(m => m.Status).WithMany().HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Classification).WithMany().HasForeignKey(m => m.ClassificationId).IsRequired().OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Address).WithMany().HasForeignKey(m => m.AddressId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Agency).WithMany(m => m.Parcels).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.PID, m.PIN }).IsUnique(); // This will allow for Crown Land to set ParcelId=0 and PIN=#######.
            builder.HasIndex(m => new { m.Latitude, m.Longitude, m.StatusId, m.IsSensitive, m.AgencyId, m.ClassificationId, m.LandArea });

            base.Configure(builder);
        }
        #endregion
    }
}
