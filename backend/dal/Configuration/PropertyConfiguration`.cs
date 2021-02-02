using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// PropertyConfiguration class, provides a way to configure properties in the database.
    ///</summary>
    public abstract class PropertyConfiguration<TBase> : BaseEntityConfiguration<TBase>
        where TBase : Property
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<TBase> builder)
        {
            builder.Property(m => m.ProjectNumbers).HasMaxLength(2000);
            builder.Property(m => m.Name).HasMaxLength(250);
            builder.Property(m => m.Description).HasMaxLength(2000);
            builder.Property(m => m.Location).HasColumnType("GEOGRAPHY").IsRequired();
            builder.Property(m => m.Boundary).HasColumnType("GEOGRAPHY");
            builder.Property(m => m.IsSensitive).HasDefaultValue(false);
            builder.Property(m => m.IsVisibleToOtherAgencies).HasDefaultValue(false);

            builder.HasOne(m => m.Classification).WithMany().HasForeignKey(m => m.ClassificationId).IsRequired().OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Address).WithMany().HasForeignKey(m => m.AddressId).OnDelete(DeleteBehavior.ClientSetNull);

            base.Configure(builder);
        }
        #endregion
    }
}
