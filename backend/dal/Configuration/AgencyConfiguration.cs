using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AgencyConfiguration class, provides a way to configure agencies in the database.
    ///</summary>
    public class AgencyConfiguration : CodeEntityConfiguration<Agency, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Agency> builder)
        {
            builder.ToTable("Agencies");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Code).HasMaxLength(6);
            builder.Property(m => m.Code).IsRequired();

            builder.Property(m => m.Name).HasMaxLength(150);
            builder.Property(m => m.Name).IsRequired();

            builder.Property(m => m.Email).HasMaxLength(250);
            builder.Property(m => m.AddressTo).HasMaxLength(100);

            builder.Property(m => m.Description).HasMaxLength(500);

            builder.HasOne(m => m.Parent).WithMany(m => m.Children).HasForeignKey(m => m.ParentId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Code, m.ParentId }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.Code, m.Name, m.ParentId, m.SortOrder });

            base.LookupConfigure(builder);
        }
        #endregion
    }
}
