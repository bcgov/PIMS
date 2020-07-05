using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusTransitionConfiguration class, provides a way to configure project status transitions in the database.
    ///</summary>
    public class ProjectStatusTransitionConfiguration : BaseEntityConfiguration<ProjectStatusTransition>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatusTransition> builder)
        {
            builder.ToTable("ProjectStatusTransitions");

            builder.HasKey(m => new { m.FromWorkflowId, m.FromStatusId, m.ToWorkflowId, m.ToStatusId });
            builder.Property(m => m.FromWorkflowId).IsRequired();
            builder.Property(m => m.FromWorkflowId).ValueGeneratedNever();
            builder.Property(m => m.FromStatusId).IsRequired();
            builder.Property(m => m.FromStatusId).ValueGeneratedNever();
            builder.Property(m => m.ToWorkflowId).IsRequired();
            builder.Property(m => m.ToWorkflowId).ValueGeneratedNever();
            builder.Property(m => m.ToStatusId).IsRequired();
            builder.Property(m => m.ToStatusId).ValueGeneratedNever();

            builder.Property(m => m.Action).HasMaxLength(100);

            builder.HasOne(m => m.FromWorkflowStatus).WithMany(m => m.ToStatus).HasForeignKey(m => new { m.FromWorkflowId, m.FromStatusId }).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.ToWorkflowStatus).WithMany(m => m.FromStatus).HasForeignKey(m => new { m.ToWorkflowId, m.ToStatusId }).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
