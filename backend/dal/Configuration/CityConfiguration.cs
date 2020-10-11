using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// CityConfiguration class, provides a way to configure cities in the database.
    ///</summary>
    public class CityConfiguration : CodeEntityConfiguration<City, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<City> builder)
        {
            builder.ToTable("Cities");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.Property(m => m.Code).HasMaxLength(4);

            builder.HasIndex(m => new { m.Id, m.IsDisabled, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
