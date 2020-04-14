using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingConstructionTypeConfiguration class, provides a way to configure building construction types in the database.
    ///</summary>
    public class BuildingConstructionTypeConfiguration : LookupEntityConfiguration<BuildingConstructionType, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<BuildingConstructionType> builder)
        {
            builder.ToTable("BuildingConstructionTypes");

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
