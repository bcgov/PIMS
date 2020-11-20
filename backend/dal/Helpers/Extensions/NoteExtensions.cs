using Pims.Dal.Entities;
using System.Linq;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// NoteExtensions static class, provides extension methods for notes.
    /// </summary>
    public static class NoteExtensions
    {
        /// <summary>
        /// Add or update the note for the specified 'type' on the 'project'.
        /// Presently only one note of each type is supported.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="type"></param>
        /// <param name="text"></param>
        /// <returns></returns>
        public static ProjectNote AddOrUpdateNote(this Project project, NoteTypes type, string text)
        {
            var note = project.GetNote(type);

            if (note == null)
            {
                note = new ProjectNote(project, type, text);
                project.Notes.Add(note);
            }
            else
            {
                note.Note = text;
            }

            return note;
        }

        /// <summary>
        /// Add or update every note in the project with the specified 'src' project notes.
        /// </summary>
        /// <param name="dest"></param>
        /// <param name="src"></param>
        public static void AddOrUpdateNotes(this Project dest, Project src)
        {
            foreach (var note in src.Notes)
            {
                dest.AddOrUpdateNote(note.NoteType, note.Note);
            }
        }

        /// <summary>
        /// Get the note for the specified 'type' if it exists.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="type"></param>
        /// <returns>Note for specified type, or null if one isn't found.</returns>
        public static ProjectNote GetNote(this Project project, NoteTypes type)
        {
            return project.Notes.FirstOrDefault(n => n.NoteType == type);
        }

        /// <summary>
        /// Get the note text for the specified 'type' if it exists.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="type"></param>
        /// <returns>Note for specified type, or null if one isn't found.</returns>
        public static string GetNoteText(this Project project, NoteTypes type)
        {
            return project.GetNote(type)?.Note;
        }
    }
}
