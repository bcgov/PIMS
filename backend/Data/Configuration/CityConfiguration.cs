using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Api.Data.Entities;

namespace Pims.Api.Data.Configuration
{
    /// <summary>
    /// CityConfiguration class, provides a way to configure cities in the database.
    ///</summary>
    public class CityConfiguration : BaseEntityConfiguration<City>
    {
        #region Methods
        public override void Configure (EntityTypeBuilder<City> builder)
        {
            builder.ToTable ("Cities");

            builder.HasKey (m => m.Id);
            builder.Property (m => m.Id).IsRequired ();
            builder.Property (m => m.Id).ValueGeneratedOnAdd ();

            builder.Property (m => m.Name).IsRequired ();
            builder.Property (m => m.Name).HasMaxLength (150);

            builder.Property (m => m.Code).IsRequired ();
            builder.Property (m => m.Code).HasMaxLength (4);

            builder.HasIndex (m => new { m.Code }).IsUnique ();
            builder.HasIndex (m => new { m.Name });

            base.Configure (builder);
        }
        #endregion
    }
}
