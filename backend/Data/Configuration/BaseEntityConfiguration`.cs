using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Api.Data.Entities;

namespace Pims.Api.Data.Configuration
{
    /// <summary>
    /// BaseEntityConfiguration class, provides a way to configure base entity in the database.
    ///</summary>
    public abstract class BaseEntityConfiguration<TBase> : IEntityTypeConfiguration<TBase> where TBase : BaseEntity
    {
        #region Methods
        public virtual void Configure (EntityTypeBuilder<TBase> builder)
        {
            builder.Property (m => m.CreatedOn).HasColumnType ("DATETIME2");
            builder.Property (m => m.CreatedOn).HasDefaultValueSql ("GETUTCDATE()");
            builder.Property (m => m.UpdatedOn).HasColumnType ("DATETIME2");
            builder.Property (m => m.RowVersion).IsRowVersion ();
            builder.Property (m => m.RowVersion).HasColumnType ("ROWVERSION");

            builder.HasOne<User> ().WithMany ().HasForeignKey (m => m.CreatedById).OnDelete (DeleteBehavior.ClientSetNull);
            builder.HasOne<User> ().WithMany ().HasForeignKey (m => m.UpdatedById).OnDelete (DeleteBehavior.ClientSetNull);
        }
        #endregion
    }
}
