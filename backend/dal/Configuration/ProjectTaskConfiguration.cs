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

            builder.HasKey(m => new { m.ProjectNumber, m.TaskId });
            builder.Property(m => m.ProjectNumber).IsRequired();
            builder.Property(m => m.ProjectNumber).ValueGeneratedNever();
            builder.Property(m => m.ProjectNumber).HasMaxLength(25);
            builder.Property(m => m.TaskId).IsRequired();
            builder.Property(m => m.TaskId).ValueGeneratedNever();

            builder.Property(m => m.CompletedOn).HasColumnType("DATETIME2");

            builder.HasOne(m => m.Project).WithMany(m => m.Tasks).HasForeignKey(m => m.ProjectNumber).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Task).WithMany().HasForeignKey(m => new { m.TaskType, m.TaskId }).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => new { m.ProjectNumber, m.TaskId, m.IsCompleted, m.CompletedOn });

            base.Configure(builder);
        }
        #endregion
    }
}
