using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingConfiguration class, provides a way to configure buildings in the database.
    ///</summary>
    public class BuildingConfiguration : BaseEntityConfiguration<Building>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Building> builder)
        {
            builder.ToTable("Buildings");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.LocalId).HasMaxLength(50);
            builder.Property(m => m.Description).HasMaxLength(2000);
            builder.Property(m => m.Latitude).IsRequired();
            builder.Property(m => m.Longitude).IsRequired();
            builder.Property(m => m.BuildingFloorCount).IsRequired();
            builder.Property(m => m.BuildingTenancy).IsRequired();
            builder.Property(m => m.LeaseExpiry).HasColumnType("DATETIME2");
            builder.Property(m => m.TransferLeaseOnSale).HasDefaultValue(false);
            builder.Property(m => m.OccupantName).HasMaxLength(100);
            builder.Property(m => m.IsSensitive).HasDefaultValue(false);

            builder.HasOne(m => m.Parcel).WithMany(m => m.Buildings).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Address).WithMany().HasForeignKey(m => m.AddressId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingConstructionType).WithMany().HasForeignKey(m => m.BuildingConstructionTypeId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingPredominateUse).WithMany().HasForeignKey(m => m.BuildingPredominateUseId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Agency).WithMany(m => m.Buildings).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingOccupantType).WithMany().HasForeignKey(m => m.BuildingOccupantTypeId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Latitude, m.Longitude, m.LocalId, m.IsSensitive, m.AgencyId, m.BuildingConstructionTypeId, m.BuildingPredominateUseId, m.BuildingOccupantTypeId, m.BuildingFloorCount, m.BuildingTenancy });

            base.Configure(builder);
        }
        #endregion
    }
}
