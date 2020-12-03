using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelBuildingConfiguration class, provides a way to configure parcel and building relationships in the database.
    ///</summary>
    public class ParcelBuildingConfiguration : BaseEntityConfiguration<ParcelBuilding>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ParcelBuilding> builder)
        {
            builder.ToTable("ParcelBuildings");

            builder.HasKey(m => new { m.ParcelId, m.BuildingId });

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.ParcelId).ValueGeneratedNever();

            builder.Property(m => m.BuildingId).IsRequired();
            builder.Property(m => m.BuildingId).ValueGeneratedNever();

            builder.HasOne(m => m.Parcel).WithMany(m => m.Buildings).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Building).WithMany(m => m.Parcels).HasForeignKey(m => m.BuildingId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
