using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;
using System;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// NotificationTemplateConfiguration class, provides a way to configure notification templates in the database.
    ///</summary>
    public class NotificationTemplateConfiguration : BaseEntityConfiguration<NotificationTemplate>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<NotificationTemplate> builder)
        {
            builder.ToTable("NotificationTemplates");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(100);

            builder.Property(m => m.Description).HasMaxLength(500);

            builder.Property(m => m.Audience).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationAudiences)Enum.Parse(typeof(NotificationAudiences), v));
            builder.Property(m => m.Priority).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationPriorities)Enum.Parse(typeof(NotificationPriorities), v));
            builder.Property(m => m.Encoding).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationEncodings)Enum.Parse(typeof(NotificationEncodings), v));
            builder.Property(m => m.BodyType).HasMaxLength(50)
                .HasConversion(v => v.ToString(), v => (NotificationBodyTypes)Enum.Parse(typeof(NotificationBodyTypes), v));

            builder.Property(m => m.Subject).IsRequired();
            builder.Property(m => m.Subject).HasMaxLength(200);

            builder.Property(m => m.To).HasMaxLength(500);
            builder.Property(m => m.Cc).HasMaxLength(500);
            builder.Property(m => m.Bcc).HasMaxLength(500);

            builder.Property(m => m.Tag).HasMaxLength(50);

            builder.HasIndex(m => m.Name).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Tag });

            base.Configure(builder);
        }
        #endregion
    }
}
