using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusHistoryConfiguration class, provides a way to keep project status history in the database.
    ///</summary>
    public class ProjectStatusHistoryConfiguration : BaseEntityConfiguration<ProjectStatusHistory>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatusHistory> builder)
        {
            builder.ToTable("ProjectStatusHistory");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id)
                .IsRequired()
                .ValueGeneratedOnAdd();

            builder.HasOne(m => m.Project).WithMany(s => s.StatusHistory).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Status).WithMany().HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(m => m.Workflow).WithMany().HasForeignKey(m => m.WorkflowId).OnDelete(DeleteBehavior.Restrict);

            base.Configure(builder);
        }
        #endregion
    }
}
