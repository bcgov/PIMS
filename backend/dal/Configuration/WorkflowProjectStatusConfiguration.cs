using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// WorkflowProjectStatusConfiguration class, provides a way to configure project properties in the database.
    ///</summary>
    public class WorkflowProjectStatusConfiguration : BaseEntityConfiguration<WorkflowProjectStatus>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<WorkflowProjectStatus> builder)
        {
            builder.ToTable("WorkflowProjectStatus");

            builder.HasKey(m => new { m.WorkflowId, m.StatusId });
            builder.Property(m => m.WorkflowId).IsRequired();
            builder.Property(m => m.WorkflowId).ValueGeneratedNever();
            builder.Property(m => m.StatusId).IsRequired();
            builder.Property(m => m.StatusId).ValueGeneratedNever();

            builder.HasOne(m => m.Workflow).WithMany(m => m.Status).HasForeignKey(m => m.WorkflowId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Status).WithMany(m => m.Workflows).HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.Cascade);

            base.Configure(builder);
        }
        #endregion
    }
}
