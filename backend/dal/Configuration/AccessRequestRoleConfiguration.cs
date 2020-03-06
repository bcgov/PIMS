using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AccessRequestRoleConfiguration class, provides a way to configure AccessRequest Roles in the database.
    ///</summary>
    public class AccessRequestRoleConfiguration : BaseEntityConfiguration<AccessRequestRole>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<AccessRequestRole> builder)
        {
            builder.ToTable("AccessRequestRoles");

            builder.HasKey(m => new { m.AccessRequestId, m.RoleId });

            builder.Property(m => m.AccessRequestId).IsRequired();
            builder.Property(m => m.AccessRequestId).ValueGeneratedNever();

            builder.Property(m => m.RoleId).IsRequired();
            builder.Property(m => m.RoleId).ValueGeneratedNever();

            builder.HasOne(m => m.AccessRequest).WithMany(m => m.Roles).HasForeignKey(m => m.AccessRequestId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
