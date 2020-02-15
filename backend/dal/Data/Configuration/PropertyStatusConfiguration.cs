using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Data.Entities;

namespace Pims.Dal.Data.Configuration
{
    /// <summary>
    /// PropertyStatusConfiguration class, provides a way to configure property status in the database.
    ///</summary>
    public class PropertyStatusConfiguration : BaseEntityConfiguration<PropertyStatus>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<PropertyStatus> builder)
        {
            builder.ToTable("PropertyStatus");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedNever();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.HasIndex(m => new { m.Name }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Name });

            base.Configure(builder);
        }
        #endregion
    }
}
