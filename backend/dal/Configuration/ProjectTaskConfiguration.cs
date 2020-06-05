using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectTaskConfiguration class, provides a way to configure project tasks in the database.
    ///</summary>
    public class ProjectTaskConfiguration : BaseEntityConfiguration<ProjectTask>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectTask> builder)
        {
            builder.ToTable("ProjectTasks");

            builder.HasKey(m => new { m.ProjectId, m.TaskId });
            builder.Property(m => m.ProjectId).IsRequired();
            builder.Property(m => m.ProjectId).ValueGeneratedNever();
            builder.Property(m => m.TaskId).IsRequired();
            builder.Property(m => m.TaskId).ValueGeneratedNever();

            builder.Property(m => m.CompletedOn).HasColumnType("DATETIME2");

            builder.HasOne(m => m.Project).WithMany(m => m.Tasks).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Task).WithMany().HasForeignKey(m => m.TaskId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => new { m.ProjectId, m.TaskId, m.IsCompleted, m.CompletedOn });

            base.Configure(builder);
        }
        #endregion
    }
}
