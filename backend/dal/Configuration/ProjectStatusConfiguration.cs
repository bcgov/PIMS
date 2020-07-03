using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusConfiguration class, provides a way to configure project status in the database.
    ///</summary>
    public class ProjectStatusConfiguration : LookupEntityConfiguration<ProjectStatus, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatus> builder)
        {
            builder.ToTable("ProjectStatus");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Code).IsRequired();
            builder.Property(m => m.Code).HasMaxLength(10);

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);
            builder.Property(m => m.GroupName).HasMaxLength(150);

            builder.Property(m => m.Description).HasMaxLength(1000);

            builder.Property(m => m.IsMilestone).HasDefaultValue(false);
            builder.Property(m => m.IsTerminal).HasDefaultValue(false);

            builder.Property(m => m.Route).IsRequired();
            builder.Property(m => m.Route).HasMaxLength(150);

            builder.HasIndex(m => new { m.Code }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Name, m.Code, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
