using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectAgencyResponseConfiguration class, provides a way to record agency responses to project notifications in the database.
    ///</summary>
    public class ProjectAgencyResponseConfiguration : BaseEntityConfiguration<ProjectAgencyResponse>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectAgencyResponse> builder)
        {
            builder.ToTable("ProjectAgencyResponses");

            builder.HasKey(m => new { m.ProjectId, m.AgencyId });
            builder.Property(m => m.ProjectId).ValueGeneratedNever();
            builder.Property(m => m.AgencyId).ValueGeneratedNever();

            builder.HasOne(m => m.Project).WithMany(m => m.Responses).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Agency).WithMany(m => m.ProjectResponses).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Notification).WithMany(m => m.Responses).HasForeignKey(m => m.NotificationId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.ProjectId, m.AgencyId, m.Response });

            base.Configure(builder);
        }
        #endregion
    }
}
