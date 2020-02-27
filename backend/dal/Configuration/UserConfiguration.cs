using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// UserConfiguration class, provides a way to configure users in the database.
    ///</summary>
    public class UserConfiguration : BaseEntityConfiguration<User>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedNever();

            builder.Property(m => m.DisplayName).IsRequired();
            builder.Property(m => m.DisplayName).HasMaxLength(100);

            builder.Property(m => m.FirstName).IsRequired();
            builder.Property(m => m.FirstName).HasMaxLength(100);

            builder.Property(m => m.MiddleName).HasMaxLength(100);

            builder.Property(m => m.LastName).IsRequired();
            builder.Property(m => m.LastName).HasMaxLength(100);

            builder.Property(m => m.Email).IsRequired();
            builder.Property(m => m.Email).HasMaxLength(100);

            builder.HasIndex(m => new { m.Email }).IsUnique();
            builder.HasIndex(m => new { m.IsDisabled, m.LastName, m.FirstName });

            base.Configure(builder);
        }
        #endregion
    }
}
