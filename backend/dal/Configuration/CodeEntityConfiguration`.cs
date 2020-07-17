using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// BaseEntityConfiguration class, provides a way to configure base entity in the database.
    ///</summary>
    public abstract class CodeEntityConfiguration<TBase, TKey> : LookupEntityConfiguration<TBase, TKey>
        where TBase : CodeEntity<TKey>
    {
        #region Methods
        protected void CodeConfigure(EntityTypeBuilder<TBase> builder)
        {
            builder.Property(m => m.Code).IsRequired();

            builder.HasIndex(m => new { m.Code }).IsUnique();

            base.Configure(builder);
        }

        public override void Configure(EntityTypeBuilder<TBase> builder)
        {
            CodeConfigure(builder);
        }
        #endregion
    }
}
