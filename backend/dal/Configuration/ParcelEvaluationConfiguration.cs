using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelEvaluationConfiguration class, provides a way to configure parcel evaluations in the database.
    ///</summary>
    public class ParcelEvaluationConfiguration : BaseEntityConfiguration<ParcelEvaluation>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ParcelEvaluation> builder)
        {
            builder.ToTable("ParcelEvaluations");

            builder.HasKey(m => new { m.FiscalYear, m.ParcelId });
            builder.Property(m => m.FiscalYear).IsRequired();
            builder.Property(m => m.FiscalYear).ValueGeneratedNever();

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.ParcelId).ValueGeneratedNever();

            builder.Property(m => m.EstimatedValue).HasColumnType("MONEY");
            builder.Property(m => m.AppraisedValue).HasColumnType("MONEY");
            builder.Property(m => m.AssessedValue).HasColumnType("MONEY");
            builder.Property(m => m.NetBookValue).HasColumnType("MONEY");

            builder.HasOne(m => m.Parcel).WithMany(m => m.Evaluations).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.AssessedValue, m.EstimatedValue, m.NetBookValue });

            base.Configure(builder);
        }
        #endregion
    }
}
