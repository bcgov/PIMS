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
            builder.Property(m => m.Zoning).HasMaxLength(50);
            builder.Property(m => m.ZoningPotential).HasMaxLength(50);
            builder.Property(m => m.LandLegalDescription).HasMaxLength(500);
            builder.Property(m => m.EncumbranceReason).HasMaxLength(500);
            builder.Property(m => m.NotOwned).HasDefaultValue(false);

            builder.HasOne(m => m.Agency).WithMany(m => m.Parcels).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.PropertyType).WithOne().HasForeignKey<Parcel>(m => m.PropertyTypeId).OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasIndex(m => m.PropertyTypeId).IsUnique(false);
            builder.HasIndex(m => new { m.PID, m.PIN }).IsUnique(); // This will allow for Crown Land to set ParcelId=0 and PIN=#######.
            builder.HasIndex(m => new { m.Id, m.AgencyId, m.IsSensitive, m.AddressId });
            builder.HasIndex(m => new { m.Id, m.IsSensitive, m.AgencyId, m.ClassificationId, m.PID, m.PIN, m.AddressId, m.ProjectNumbers, m.LandArea, m.Zoning, m.ZoningPotential });

            base.Configure(builder);
        }
        #endregion
    }
}
