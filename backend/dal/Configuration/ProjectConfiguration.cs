using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectConfiguration class, provides a way to configure projects in the database.
    ///</summary>
    public class ProjectConfiguration : BaseEntityConfiguration<Project>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("Projects");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.ProjectNumber).IsRequired();
            builder.Property(m => m.ProjectNumber).HasMaxLength(25);

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(100);

            builder.Property(m => m.Description).HasMaxLength(1000);
            builder.Property(m => m.Note).HasMaxLength(2000);
            builder.Property(m => m.PublicNote).HasMaxLength(2000);
            builder.Property(m => m.PrivateNote).HasMaxLength(2000);
            builder.Property(m => m.AgencyResponseNote).HasMaxLength(2000);

            builder.Property(m => m.ExemptionRequested).HasDefaultValue(false);
            builder.Property(m => m.ExemptionRationale).HasMaxLength(2000);

            builder.Property(m => m.SubmittedOn).HasColumnType("DATETIME2");
            builder.Property(m => m.ApprovedOn).HasColumnType("DATETIME2");
            builder.Property(m => m.DeniedOn).HasColumnType("DATETIME2");
            builder.Property(m => m.CancelledOn).HasColumnType("DATETIME2");
            builder.Property(m => m.InitialNotificationSentOn).HasColumnType("DATETIME2");
            builder.Property(m => m.ThirtyDayNotificationSentOn).HasColumnType("DATETIME2");
            builder.Property(m => m.SixtyDayNotificationSentOn).HasColumnType("DATETIME2");
            builder.Property(m => m.NinetyDayNotificationSentOn).HasColumnType("DATETIME2");
            builder.Property(m => m.OnHoldNotificationSentOn).HasColumnType("DATETIME2");
            builder.Property(m => m.TransferredWithinGreOn).HasColumnType("DATETIME2");
            builder.Property(m => m.ClearanceNotificationSentOn).HasColumnType("DATETIME2");

            builder.Property(m => m.NetBook).HasColumnType("MONEY");
            builder.Property(m => m.Estimated).HasColumnType("MONEY");
            builder.Property(m => m.Assessed).HasColumnType("MONEY");

            builder.HasOne(m => m.Status).WithMany().HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Agency).WithMany().HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.TierLevel).WithMany().HasForeignKey(m => m.TierLevelId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => m.ProjectNumber).IsUnique();
            builder.HasIndex(m => new { m.Name, m.StatusId, m.TierLevelId, m.AgencyId });
            builder.HasIndex(m => new { m.Assessed, m.NetBook, m.Estimated, m.FiscalYear, m.ExemptionRequested });

            base.Configure(builder);
        }
        #endregion
    }
}
