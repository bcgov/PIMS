using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// TaskConfiguration class, provides a way to configure process tasks in the database.
    ///</summary>
    public class TaskConfiguration : LookupEntityConfiguration<Task, int>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<Task> builder)
        {
            builder.ToTable("Tasks");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.Name).IsRequired();
            builder.Property(m => m.Name).HasMaxLength(150);

            builder.Property(m => m.Description).HasMaxLength(1000);

            builder.HasOne(m => m.Status).WithMany(m => m.Tasks).HasForeignKey(m => m.StatusId).OnDelete(DeleteBehavior.ClientSetNull);

            builder.HasIndex(m => new { m.IsDisabled, m.IsOptional, m.Name, m.SortOrder });

            base.Configure(builder);
        }
        #endregion
    }
}
