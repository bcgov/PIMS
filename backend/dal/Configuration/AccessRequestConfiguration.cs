using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AccessRequestConfiguration class, provides a way to configure users in the database.
    ///</summary>
    public class AccessRequestConfiguration : BaseEntityConfiguration<AccessRequest>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<AccessRequest> builder)
        {
            builder.ToTable("AccessRequests");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedNever();

            builder.Property(m => m.IsGranted);

            builder.HasOne(m => m.User).WithMany().HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.ClientSetNull);
            builder.HasMany(m => m.Agencies).WithOne();
            builder.HasMany(m => m.Roles).WithOne();

            builder.HasIndex(m => new { m.IsDisabled, m.IsGranted });

            base.Configure(builder);
        }
        #endregion
    }
}
