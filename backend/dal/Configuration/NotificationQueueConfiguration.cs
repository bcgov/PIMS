using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;
using System;

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

            builder.Property(m => m.Priority).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationPriorities)Enum.Parse(typeof(NotificationPriorities), v));
            builder.Property(m => m.Encoding).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationEncodings)Enum.Parse(typeof(NotificationEncodings), v));
            builder.Property(m => m.BodyType).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationBodyTypes)Enum.Parse(typeof(NotificationBodyTypes), v));

            builder.Property(m => m.Subject).IsRequired();
            builder.Property(m => m.Subject).HasMaxLength(200);

            builder.Property(m => m.Body).IsRequired();

            builder.Property(m => m.Tag).HasMaxLength(50);

            builder.Property(m => m.To).HasMaxLength(500);
            builder.Property(m => m.Bcc).HasMaxLength(500);
            builder.Property(m => m.Cc).HasMaxLength(500);

            builder.HasOne(m => m.Project).WithMany(m => m.Notifications).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.ToAgency).WithMany(m => m.Notifications).HasForeignKey(m => m.ToAgencyId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasOne(m => m.Template).WithMany(m => m.Notifications).HasForeignKey(m => m.TemplateId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Key }).IsUnique();
            builder.HasIndex(m => new { m.Status, m.SendOn, m.Subject });
            builder.HasIndex(m => new { m.ProjectId, m.TemplateId, m.ToAgencyId });

            base.Configure(builder);
        }
        #endregion
    }
}
