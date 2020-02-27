using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProvinceConfiguration class, provides a way to configure provinces in the database.
    ///</summary>
    public class ProvinceConfiguration : BaseEntityConfiguration<Province>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Province> builder)
        {
            builder.ToTable("Provinces");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedNever();
            builder.Property(m => m.Id).HasMaxLength(2);

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.HasIndex(m => new { m.Name }).IsUnique();

            base.Configure(builder);
        }
        #endregion
    }
}
