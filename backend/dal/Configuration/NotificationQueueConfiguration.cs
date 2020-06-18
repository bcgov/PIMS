using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// NotificationQueueConfiguration class, provides a way to manage a notification queue in the database.
    ///</summary>
    public class NotificationQueueConfiguration : BaseEntityConfiguration<NotificationQueue>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<NotificationQueue> builder)
        {
            builder.ToTable("NotificationQueue");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.SendOn).HasColumnType("DATETIME2");

            builder.Property(m => m.Encoding).HasMaxLength(50);
            builder.Property(m => m.BodyType).HasMaxLength(50);

            builder.Property(m => m.Subject).IsRequired();
            builder.Property(m => m.Subject).HasMaxLength(200);

            builder.Property(m => m.Body).IsRequired();

            builder.Property(m => m.Tag).HasMaxLength(50);

            builder.Property(m => m.To).HasMaxLength(100);
            builder.Property(m => m.Bcc).HasMaxLength(100);
            builder.Property(m => m.Cc).HasMaxLength(100);

            builder.HasOne(m => m.Project).WithMany().HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.ToAgency).WithMany().HasForeignKey(m => m.ToAgencyId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Key, m.Status, m.SendOn, m.Subject, m.ProjectId, m.ToAgencyId });

            base.Configure(builder);
        }
        #endregion
    }
}
