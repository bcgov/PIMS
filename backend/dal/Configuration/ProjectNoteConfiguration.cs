using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;

namespace Pims.Dal.Configuration
{
    /// <summary>
    /// ProjectNoteConfiguration class, provides a way to configure project notes in the database.
    ///</summary>
    public class ProjectNoteConfiguration : BaseEntityConfiguration<ProjectNote>
    {
        #region Methods
        public override void Configure(EntityTypeBuilder<ProjectNote> builder)
        {
            builder.ToTable("ProjectNotes");

            builder.HasKey(m => m.Id);
            builder.Property(m => m.Id).IsRequired();
            builder.Property(m => m.Id).ValueGeneratedOnAdd();

            builder.Property(m => m.ProjectId).IsRequired();
            builder.Property(m => m.NoteType).IsRequired();

            builder.Property(m => m.Note).IsRequired();
            builder.Property(m => m.Note).HasColumnType("NVARCHAR(MAX)");

            builder.HasOne(m => m.Project).WithMany(m => m.Notes).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.ClientCascade);

            builder.HasIndex(m => new { m.ProjectId, m.NoteType });

            base.Configure(builder);
        }
        #endregion
    }
}
