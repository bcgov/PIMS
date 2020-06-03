using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectStatusTransitionConfiguration class, provides a way to configure valid project status transitions in the database.
    ///</summary>
    public class ProjectStatusTransitionConfiguration : BaseEntityConfiguration<ProjectStatusTransition>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectStatusTransition> builder)
        {
            builder.ToTable("ProjectStatusTransitions");

            builder.HasKey(m => new { m.StatusId, m.ToStatusId });
            builder.Property(m => m.StatusId).IsRequired();
            builder.Property(m => m.StatusId).ValueGeneratedNever();
            builder.Property(m => m.ToStatusId).IsRequired();
            builder.Property(m => m.ToStatusId).ValueGeneratedNever();

            builder.HasOne(m => m.Status).WithMany(m => m.ToStatus).HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.ToStatus).WithMany(m => m.FromStatus).HasForeignKey(m => m.ToStatusId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
