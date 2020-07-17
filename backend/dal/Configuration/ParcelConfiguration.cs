using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelConfiguration class, provides a way to configure parcels in the database.
    ///</summary>
    public class ParcelConfiguration : PropertyConfiguration<Parcel>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Parcel> builder)
        {
            builder.ToTable("Parcels");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.PID).IsRequired();
            builder.Property(m => m.Municipality).HasMaxLength(250);
            builder.Property(m => m.Zoning).HasMaxLength(50);
            builder.Property(m => m.ZoningPotential).HasMaxLength(50);
            builder.Property(m => m.LandLegalDescription).HasMaxLength(500);
            builder.Property(m => m.NotOwned).HasDefaultValue(false);

            builder.HasOne(m => m.Agency).WithMany(m => m.Parcels).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.PID, m.PIN }).IsUnique(); // This will allow for Crown Land to set ParcelId=0 and PIN=#######.
            builder.HasIndex(m => new { m.Latitude, m.Longitude, m.IsSensitive, m.AgencyId, m.ClassificationId, m.ProjectNumber, m.LandArea, m.Municipality, m.Zoning, m.ZoningPotential, m.Description });

            base.Configure(builder);
        }
        #endregion
    }
}
