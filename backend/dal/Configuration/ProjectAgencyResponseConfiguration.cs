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
            builder.Property(m => m.OfferAmount).HasColumnType("MONEY");

            builder.HasOne(m => m.Project).WithMany(m => m.Responses).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Agency).WithMany(m => m.ProjectResponses).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Notification).WithMany(m => m.Responses).HasForeignKey(m => m.NotificationId).OnDelete(DeleteBehavior.ClientCascade).IsRequired(false);

            builder.Property(m => m.Note).HasMaxLength(2000);
            builder.Property(m => m.ReceivedOn).HasColumnType("DATETIME2");

            builder.HasIndex(m => new { m.ProjectId, m.AgencyId, m.Response, m.ReceivedOn, m.Note });

            base.Configure(builder);
        }
        #endregion
    }
}
