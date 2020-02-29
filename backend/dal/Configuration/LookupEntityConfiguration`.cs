using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BaseEntityConfiguration class, provides a way to configure base entity in the database.
    ///</summary>
    public abstract class LookupEntityConfiguration<TBase> : BaseEntityConfiguration<TBase> where TBase : LookupEntity
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<TBase> builder)
        {
            builder.Property(m => m.SortOrder).HasDefaultValue(0);
            builder.Property(m => m.IsDisabled).HasDefaultValue(false);

            base.Configure(builder);
        }
        #endregion
    }
}
