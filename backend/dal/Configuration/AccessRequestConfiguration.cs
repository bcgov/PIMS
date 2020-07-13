using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AccessRequestConfiguration class, provides a way to configure users access requests in the database.
    ///</summary>
    public class AccessRequestConfiguration : BaseEntityConfiguration<AccessRequest>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<AccessRequest> builder)
        {
            builder.ToTable("AccessRequests");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Status);

            builder.HasOne(m => m.User).WithMany().HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Status });

            base.Configure(builder);
        }
        #endregion
    }
}
