using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// TierLevelConfiguration class, provides a way to configure project tier levels in the database.
    ///</summary>
    public class TierLevelConfiguration : LookupEntityConfiguration<TierLevel, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<TierLevel> builder)
        {
            builder.ToTable("TierLevels");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.Property(m => m.Description).HasMaxLength(1000);

            builder.HasIndex(m => new { m.Name }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
