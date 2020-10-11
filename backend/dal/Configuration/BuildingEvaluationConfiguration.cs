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

            builder.HasKey(m => new { m.BuildingId, m.Date, m.Key });

            builder.Property(m => m.BuildingId).IsRequired();
            builder.Property(m => m.BuildingId).ValueGeneratedNever();

            builder.Property(m => m.Date).HasColumnType("DATE").IsRequired();

            builder.Property(m => m.Key).IsRequired();

            builder.Property(m => m.Value).HasColumnType("MONEY");
            builder.Property(m => m.Note).HasMaxLength(500);

            builder.HasOne(m => m.Building).WithMany(m => m.Evaluations).HasForeignKey(m => m.BuildingId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.BuildingId, m.Key });
            builder.HasIndex(m => new { m.BuildingId, m.Date, m.Key, m.Value });

            base.Configure(builder);
        }
        #endregion
    }
}
