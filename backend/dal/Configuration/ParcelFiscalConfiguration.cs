using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ParcelFiscalConfiguration class, provides a way to configure parcel fiscals in the database.
    ///</summary>
    public class ParcelFiscalConfiguration : BaseEntityConfiguration<ParcelFiscal>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ParcelFiscal> builder)
        {
            builder.ToTable("ParcelFiscals");

            builder.HasKey(m => new { m.ParcelId, m.FiscalYear, m.Key });

            builder.Property(m => m.ParcelId).IsRequired();
            builder.Property(m => m.ParcelId).ValueGeneratedNever();

            builder.Property(m => m.FiscalYear).IsRequired();
            builder.Property(m => m.FiscalYear).ValueGeneratedNever();

            builder.Property(m => m.EffectiveDate).HasColumnType("DATE");

            builder.Property(m => m.Key).IsRequired();

            builder.Property(m => m.Value).HasColumnType("MONEY");
            builder.Property(m => m.Note).HasMaxLength(500);

            builder.HasOne(m => m.Parcel).WithMany(m => m.Fiscals).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.ParcelId, m.FiscalYear, m.Key, m.Value });
            builder.HasIndex(m => new { m.ParcelId, m.Key });

            base.Configure(builder);
        }
        #endregion
    }
}
