using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// PropertyTypeConfiguration class, provides a way to configure property types in the database.
    ///</summary>
    public class PropertyTypeConfiguration : LookupEntityConfiguration<PropertyType, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<PropertyType> builder)
        {
            builder.ToTable("PropertyTypes");

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
