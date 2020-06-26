using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusNotificationConfiguration class, provides a way to configure valid project status notifications in the database.
    ///</summary>
    public class ProjectStatusNotificationConfiguration : BaseEntityConfiguration<ProjectStatusNotification>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatusNotification> builder)
        {
            builder.ToTable("ProjectStatusNotifications");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.HasOne(m => m.Template).WithMany(m => m.Status).HasForeignKey(m => m.TemplateId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.FromStatus).WithMany().HasForeignKey(m => m.FromStatusId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.ToStatus).WithMany().HasForeignKey(m => m.ToStatusId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.FromStatusId, m.ToStatusId });

            base.Configure(builder);
        }
        #endregion
    }
}
