using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectRiskConfiguration class, provides a way to configure project risks in the database.
    ///</summary>
    public class ProjectRiskConfiguration : CodeEntityConfiguration<ProjectRisk, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectRisk> builder)
        {
            builder.ToTable("ProjectRisks");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Code).HasMaxLength(10);
            builder.Property(m => m.Code).IsRequired();

            builder.Property(m => m.Name).HasMaxLength(150);
            builder.Property(m => m.Name).IsRequired();

            builder.Property(m => m.Description).HasMaxLength(500);

            builder.HasIndex(m => new { m.Code }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Code, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
