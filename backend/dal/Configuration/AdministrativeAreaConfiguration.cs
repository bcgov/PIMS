using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AdministrativeAreaConfiguration class, provides a way to configure administrative areas in the database.
    ///</summary>
    public class AdministrativeAreaConfiguration : LookupEntityConfiguration<AdministrativeArea, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<AdministrativeArea> builder)
        {
            builder.ToTable("AdministrativeAreas");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.Property(m => m.Abbreviation).HasMaxLength(100);
            builder.Property(m => m.BoundaryType).HasMaxLength(50);
            builder.Property(m => m.GroupName).HasMaxLength(250);

            builder.HasIndex(m => new { m.Id, m.IsDisabled, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
