using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusTaskConfiguration class, provides a way to configure project status tasks in the database.
    ///</summary>
    public class ProjectStatusTaskConfiguration : BaseEntityConfiguration<ProjectStatusTask>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatusTask> builder)
        {
            builder.ToTable("ProjectStatusTasks");

            builder.HasKey(m => new { m.StatusId, m.TaskId });
            builder.Property(m => m.StatusId).IsRequired();
            builder.Property(m => m.StatusId).ValueGeneratedNever();
            builder.Property(m => m.TaskId).IsRequired();
            builder.Property(m => m.TaskId).ValueGeneratedNever();

            builder.HasOne(m => m.Status).WithMany(m => m.Tasks).HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Task).WithMany().HasForeignKey(m => m.TaskId).OnDelete(DeleteBehavior.Cascade);

            base.Configure(builder);
        }
        #endregion
    }
}
