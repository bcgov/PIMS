using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectConfiguration class, provides a way to configure projects in the database.
    ///</summary>
    public class ProjectConfiguration : BaseEntityConfiguration<Project>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Projects");

            builder.HasKey(m => m.ProjectNumber);
            builder.Property(m => m.ProjectNumber).IsRequired();
            builder.Property(m => m.ProjectNumber).ValueGeneratedNever();
            builder.Property(m => m.ProjectNumber).HasMaxLength(25);

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(100);

            builder.Property(m => m.Description).HasMaxLength(1000);
            builder.Property(m => m.Note).HasMaxLength(2000);

            builder.HasOne(m => m.TierLevel).WithMany().HasForeignKey(m => m.TierLevelId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.ProjectStatus).WithMany().HasForeignKey(m => m.ProjectStatusId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => new { m.Name }).IsUnique();
            builder.HasIndex(m => new { m.Name, m.ProjectStatusId, m.TierLevelId });

            base.Configure(builder);
        }
        #endregion
    }
}
