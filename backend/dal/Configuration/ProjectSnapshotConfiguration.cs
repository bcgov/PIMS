using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Core.Extensions;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectSnapshotConfiguration class, provides a way to configure project Snapshot in the database.
    ///</summary>
    public class ProjectSnapshotConfiguration : BaseEntityConfiguration<ProjectSnapshot>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectSnapshot> builder)
        {
            builder.ToTable("ProjectSnapshots");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.ProjectId).IsRequired();

            builder.Property(m => m.SnapshotOn).HasColumnType("DATETIME2");

            builder.Property(m => m.NetBook).HasColumnType("MONEY");
            builder.Property(m => m.Estimated).HasColumnType("MONEY");
            builder.Property(m => m.Assessed).HasColumnType("MONEY");
            builder.Property(m => m.Appraised).HasColumnType("MONEY");
            builder.Property(m => m.SalesCost).HasColumnType("MONEY");
            builder.Property(m => m.NetProceeds).HasColumnType("MONEY");
            builder.Property(m => m.BaselineIntegrity).HasColumnType("MONEY");
            builder.Property(m => m.ProgramCost).HasColumnType("MONEY");
            builder.Property(m => m.GainLoss).HasColumnType("MONEY");
            builder.Property(m => m.OcgFinancialStatement).HasColumnType("MONEY");
            builder.Property(m => m.InterestComponent).HasColumnType("MONEY");

            builder.HasOne(m => m.Project).WithMany(p => p.Snapshots).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => new { m.ProjectId, m.SnapshotOn });

            base.Configure(builder);
        }
        #endregion
    }
}
