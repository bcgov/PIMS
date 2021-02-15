using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingConfiguration class, provides a way to configure buildings in the database.
    ///</summary>
    public class BuildingConfiguration : PropertyConfiguration<Building>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Building> builder)
        {
            builder.ToTable("Buildings");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.LeasedLandMetadata).HasColumnType("NVARCHAR(MAX)");

            builder.Property(m => m.BuildingFloorCount).IsRequired();
            builder.Property(m => m.BuildingTenancy).IsRequired();
            builder.Property(m => m.LeaseExpiry).HasColumnType("DATETIME2");
            builder.Property(m => m.BuildingTenancyUpdatedOn).HasColumnType("DATETIME2");
            builder.Property(m => m.TransferLeaseOnSale).HasDefaultValue(false);
            builder.Property(m => m.OccupantName).HasMaxLength(100);
            builder.Property(m => m.EncumbranceReason).HasMaxLength(500);

            builder.HasOne(m => m.Agency).WithMany(m => m.Buildings).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingConstructionType).WithMany().HasForeignKey(m => m.BuildingConstructionTypeId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingPredominateUse).WithMany().HasForeignKey(m => m.BuildingPredominateUseId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.BuildingOccupantType).WithMany().HasForeignKey(m => m.BuildingOccupantTypeId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasOne(m => m.PropertyType).WithOne().HasPrincipalKey<PropertyType>(m => m.Id).HasForeignKey<Building>(m => m.PropertyTypeId).OnDelete(DeleteBehavior.ClientNoAction);

            builder.HasIndex(m => m.PropertyTypeId).IsUnique(false);
            builder.HasIndex(m => new { m.Id, m.IsSensitive, m.AgencyId, m.ClassificationId, m.AddressId, m.ProjectNumbers, m.BuildingConstructionTypeId, m.BuildingPredominateUseId, m.BuildingOccupantTypeId, m.BuildingFloorCount, m.BuildingTenancy });

            base.Configure(builder);
        }
        #endregion
    }
}
