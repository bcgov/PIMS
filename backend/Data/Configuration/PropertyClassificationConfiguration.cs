using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Api.Data.Entities;

namespace Pims.Api.Data.Configuration
{
    /// <summary>
    /// PropertyClassificationConfiguration class, provides a way to configure property classifications in the database.
    ///</summary>
    public class PropertyClassificationConfiguration : BaseEntityConfiguration<PropertyClassification>
    {
        #region Methods
        public override void Configure (EntityTypeBuilder<PropertyClassification> builder)
        {
            builder.ToTable ("PropertyClassifications");

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
