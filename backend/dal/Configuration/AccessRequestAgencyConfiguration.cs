using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AccessRequestAgencyConfiguration class, provides a way to configure AccessRequest Agencies in the database.
    /// </summary>
    public class AccessRequestAgencyConfiguration : BaseEntityConfiguration<AccessRequestAgency>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<AccessRequestAgency> builder)
        {
            builder.ToTable("AccessRequestAgencies");

            builder.HasKey(m => new { m.AccessRequestId, m.AgencyId });

            builder.Property(m => m.AccessRequestId).IsRequired();
            builder.Property(m => m.AccessRequestId).ValueGeneratedNever();

            builder.Property(m => m.AgencyId).IsRequired();
            builder.Property(m => m.AgencyId).ValueGeneratedNever();

            builder.HasOne(m => m.AccessRequest).WithMany(m => m.Agencies).HasForeignKey(m => m.AccessRequestId).OnDelete(DeleteBehavior.ClientCascade);

            base.Configure(builder);
        }
        #endregion
    }
}
