using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectNumberConfiguration class, provides a way to configure project numbers in the database.
    ///</summary>
    public class ProjectNumberConfiguration : BaseEntityConfiguration<ProjectNumber>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectNumber> builder)
        {
            builder.ToTable("ProjectNumbers");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            base.Configure(builder);
        }
        #endregion
    }
}
