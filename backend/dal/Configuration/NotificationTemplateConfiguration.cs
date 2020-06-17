using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

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

            builder.Property(m => m.Encoding).HasMaxLength(50);
            builder.Property(m => m.BodyType).HasMaxLength(50);

            builder.Property(m => m.Subject).IsRequired();
            builder.Property(m => m.Subject).HasMaxLength(200);

            builder.Property(m => m.Tag).HasMaxLength(50);

            builder.HasIndex(m => m.Name ).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Tag });

            base.Configure(builder);
        }
        #endregion
    }
}
