using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// RoleClaimConfiguration class, provides a way to configure user roles in the database.
    ///</summary>
    public class RoleClaimConfiguration : BaseEntityConfiguration<RoleClaim>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<RoleClaim> builder)
        {
            builder.ToTable("RoleClaims");

            builder.HasKey(m => new { m.RoleId, m.ClaimId });

            builder.Property(m => m.RoleId).IsRequired();
            builder.Property(m => m.RoleId).ValueGeneratedNever();

            builder.Property(m => m.ClaimId).IsRequired();
            builder.Property(m => m.ClaimId).ValueGeneratedNever();

            builder.HasOne(m => m.Role).WithMany(m => m.Claims).HasForeignKey(m => m.RoleId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Claim).WithMany(m => m.Roles).HasForeignKey(m => m.ClaimId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
