using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BaseEntityConfiguration class, provides a way to configure base entity in the database.
    ///</summary>
    public abstract class LookupEntityConfiguration<TBase, TKey> : BaseEntityConfiguration<TBase>
        where TBase : LookupEntity<TKey>
    {
        #region Methods
        protected void LookupConfigure(EntityTypeBuilder<TBase> builder)
        {
            builder.Property(m => m.SortOrder).HasDefaultValue(0);
            builder.Property(m => m.IsDisabled).HasDefaultValue(false);

            base.Configure(builder);
        }

        public override void Configure(EntityTypeBuilder<TBase> builder)
        {
            LookupConfigure(builder);
        }
        #endregion
    }
}
