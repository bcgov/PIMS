using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Api.Data.Entities;

namespace Pims.Api.Data.Configuration
{
    /// <summary>
    /// BuildingConstructionTypeConfiguration class, provides a way to configure building construction types in the database.
    ///</summary>
    public class BuildingConstructionTypeConfiguration : BaseEntityConfiguration<BuildingConstructionType>
    {
        #region Methods
        public override void Configure (EntityTypeBuilder<BuildingConstructionType> builder)
        {
            builder.ToTable ("BuildingConstructionTypes");

            builder.HasKey (m => m.Id);
            builder.Property (m => m.Id).IsRequired ();
            builder.Property (m => m.Id).ValueGeneratedNever ();

            builder.Property (m => m.Name).IsRequired ();
            builder.Property (m => m.Name).HasMaxLength (150);

            builder.Property (m => m.IsDisabled).HasDefaultValueSql ("1");

            builder.HasIndex (m => new { m.Name }).IsUnique ();

            base.Configure (builder);
        }
        #endregion
    }
}
