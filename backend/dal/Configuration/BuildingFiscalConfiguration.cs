using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BuildingFiscalConfiguration class, provides a way to configure building fiscals in the database.
    ///</summary>
    public class BuildingFiscalConfiguration : BaseEntityConfiguration<BuildingFiscal>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<BuildingFiscal> builder)
        {
            builder.ToTable("BuildingFiscals");

            builder.HasKey(m => new { m.BuildingId, m.FiscalYear, m.Key });

            builder.Property(m => m.BuildingId).IsRequired();
            builder.Property(m => m.BuildingId).ValueGeneratedNever();

            builder.Property(m => m.FiscalYear).IsRequired();
            builder.Property(m => m.FiscalYear).ValueGeneratedNever();

            builder.Property(m => m.EffectiveDate).HasColumnType("DATE");

            builder.Property(m => m.Key).IsRequired();

            builder.Property(m => m.Value).HasColumnType("MONEY");
            builder.Property(m => m.Note).HasMaxLength(500);

            builder.HasOne(m => m.Building).WithMany(m => m.Fiscals).HasForeignKey(m => m.BuildingId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.BuildingId, m.Key });
            builder.HasIndex(m => new { m.BuildingId, m.FiscalYear, m.Key, m.Value });

            base.Configure(builder);
        }
        #endregion
    }
}
