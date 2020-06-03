using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectPropertyConfiguration class, provides a way to configure project properties in the database.
    ///</summary>
    public class ProjectPropertyConfiguration : BaseEntityConfiguration<ProjectProperty>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectProperty> builder)
        {
            builder.ToTable("ProjectProperties");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.ProjectId).IsRequired();

            builder.HasOne(m => m.Project).WithMany(m => m.Properties).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Parcel).WithMany(m => m.Projects).HasForeignKey(m => m.ParcelId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(m => m.Building).WithMany(m => m.Projects).HasForeignKey(m => m.BuildingId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => new { m.ProjectId, m.ParcelId, m.BuildingId }).IsUnique();

            base.Configure(builder);
        }
        #endregion
    }
}
