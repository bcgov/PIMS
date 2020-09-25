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

            builder.HasKey(m => new { m.ParcelId, m.Date, m.Key });

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.ParcelId).ValueGeneratedNever();

            builder.Property(m => m.Date).HasColumnType("DATE").IsRequired();

            builder.Property(m => m.Key).IsRequired();

            builder.Property(m => m.Value).HasColumnType("MONEY");
            builder.Property(m => m.Note).HasMaxLength(500);
            builder.Property(m => m.Firm).HasMaxLength(150);

            builder.HasOne(m => m.Parcel).WithMany(m => m.Evaluations).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.ParcelId, m.Date, m.Key, m.Value });
            builder.HasIndex(m => new { m.ParcelId, m.Key });

            base.Configure(builder);
        }
        #endregion
    }
}
