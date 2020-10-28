using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// AddressConfiguration class, provides a way to configure addresses in the database.
    ///</summary>
    public class AddressConfiguration : BaseEntityConfiguration<Address>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.ToTable("Addresses");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Address1).HasMaxLength(150);

            builder.Property(m => m.Address2).HasMaxLength(150);

            builder.Property(m => m.Postal).HasMaxLength(6);

            builder.Property(m => m.ProvinceId).HasMaxLength(2);
            builder.Property(m => m.ProvinceId).IsRequired();

            builder.HasOne(m => m.Province).WithMany().HasForeignKey(m => m.ProvinceId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.Id, m.AdministrativeArea }).IncludeProperties(m => new { m.Address1, m.Address2 });
            builder.HasIndex(m => new { m.Id, m.Postal }).IncludeProperties(m => new { m.Address1, m.Address2 });
            builder.HasIndex(m => new { m.Id, m.Address1 }).IncludeProperties(m => new { m.Address2 });
            builder.HasIndex(m => new { m.AdministrativeArea, m.ProvinceId }).IncludeProperties(m => new { m.Address1, m.Address2 });
            builder.HasIndex(m => new { m.Id, m.ProvinceId, m.AdministrativeArea, m.Postal, m.Address1 }).IncludeProperties(m => new { m.Address2 });

            base.Configure(builder);
        }
        #endregion
    }
}
