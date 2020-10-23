using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Core.Extensions;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectReportConfiguration class, provides a way to configure project reports in the database.
    ///</summary>
    public class ProjectReportConfiguration : BaseEntityConfiguration<ProjectReport>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectReport> builder)
        {
            builder.ToTable("ProjectReports");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).HasMaxLength(250).IsNullable();

            builder.Property(m => m.From).HasColumnType("DATETIME2");
            builder.Property(m => m.To).HasColumnType("DATETIME2").IsRequired();

            builder.HasIndex(m => new { m.Id, m.To, m.From, m.IsFinal });

            base.Configure(builder);
        }
        #endregion
    }
}
