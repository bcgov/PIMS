using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// UserAgencyConfiguration class, provides a way to configure user agencies in the database.
    ///</summary>
    public class UserAgencyConfiguration : BaseEntityConfiguration<UserAgency>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<UserAgency> builder)
        {
            builder.ToTable("UserAgencies");

            builder.HasKey(m => new { m.UserId, m.AgencyId });

            builder.Property(m => m.UserId).IsRequired();
            builder.Property(m => m.UserId).ValueGeneratedNever();

            builder.Property(m => m.AgencyId).IsRequired();
            builder.Property(m => m.AgencyId).ValueGeneratedNever();

            builder.HasOne(m => m.User).WithMany(m => m.Agencies).HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.ClientCascade);
            builder.HasOne(m => m.Agency).WithMany(m => m.Users).HasForeignKey(m => m.AgencyId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
