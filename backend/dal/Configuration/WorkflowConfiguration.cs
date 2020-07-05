using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// WorkflowConfiguration class, provides a way to configure workflow in the database.
    ///</summary>
    public class WorkflowConfiguration : LookupEntityConfiguration<Workflow, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Workflow> builder)
        {
            builder.ToTable("Workflows");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.Property(m => m.Code).IsRequired();
            builder.Property(m => m.Code).HasMaxLength(20);

            builder.Property(m => m.Description).IsRequired();
            builder.Property(m => m.Description).HasMaxLength(500);

            builder.HasIndex(m => new { m.Name }).IsUnique();
            builder.HasIndex(m => new { m.Code }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
