using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelParcelsConfiguration class, provides a way to configure parcel and parcels(Subdivision) relationships in the database.
    ///</summary>
    public class ParcelParcelsConfiguration : BaseEntityConfiguration<ParcelParcel>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ParcelParcel> builder)
        {
            builder.ToTable("ParcelParcels");

            builder.HasKey(m => new { m.ParcelId, m.SubdivisionId });

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.ParcelId).ValueGeneratedNever();

            builder.Property(m => m.SubdivisionId).IsRequired();
            builder.Property(m => m.SubdivisionId).ValueGeneratedNever();


            //I had some trouble getting this to work as A->A Many to Many relationships aren't documented well on the fluent efcore site. Based on:
            // https://stackoverflow.com/questions/49214748/many-to-many-self-referencing-relationship/49219124#49219124
            builder.HasOne(m => m.Parcel).WithMany(m => m.Subdivisions).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(m => m.Subdivision).WithMany(m => m.Parcels).HasForeignKey(m => m.SubdivisionId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
