using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingPredominateUseConfiguration class, provides a way to configure building predominate uses in the database.
    ///</summary>
    public class BuildingPredominateUseConfiguration : LookupEntityConfiguration<BuildingPredominateUse, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<BuildingPredominateUse> builder)
        {
            builder.ToTable("BuildingPredominateUses");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedNever();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.HasIndex(m => new { m.Name }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
