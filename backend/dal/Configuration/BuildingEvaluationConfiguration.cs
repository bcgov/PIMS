using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingEvaluationConfiguration class, provides a way to configure building evaluations in the database.
    ///</summary>
    public class BuildingEvaluationConfiguration : BaseEntityConfiguration<BuildingEvaluation>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<BuildingEvaluation> builder)
        {
            builder.ToTable("BuildingEvaluations");

            builder.HasKey(m => new { m.FiscalYear, m.BuildingId });
            builder.Property(m => m.FiscalYear).IsRequired();
            builder.Property(m => m.FiscalYear).ValueGeneratedNever();

            builder.Property(m => m.BuildingId).IsRequired();
            builder.Property(m => m.BuildingId).ValueGeneratedNever();

            builder.HasOne(m => m.Building).WithMany(m => m.Evaluations).HasForeignKey(m => m.BuildingId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.AssessedValue, m.EstimatedValue, m.NetBookValue });

            base.Configure(builder);
        }
        #endregion
    }
}
