using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// UserRoleConfiguration class, provides a way to configure user roles in the database.
    ///</summary>
    public class UserRoleConfiguration : BaseEntityConfiguration<UserRole>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.ToTable("UserRoles");

            builder.HasKey(m => new { m.UserId, m.RoleId });

            builder.Property(m => m.UserId).IsRequired();
            builder.Property(m => m.UserId).ValueGeneratedNever();

            builder.Property(m => m.RoleId).IsRequired();
            builder.Property(m => m.RoleId).ValueGeneratedNever();

            builder.HasOne(m => m.User).WithMany(m => m.Roles).HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Role).WithMany(m => m.Users).HasForeignKey(m => m.RoleId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
