namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectNoteModel class, provides a model to represent a project note.
    /// </summary>
    public class ProjectNoteModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key for the project note.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The linked project.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The type of note.
        /// </summary>
        public int NoteType { get; set; }

        /// <summary>
        /// get/set - The note.
        /// </summary>
        public string Note { get; set; }
        #endregion
    }
}
