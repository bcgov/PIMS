using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Import
{
    /// <summary>
    /// ImportOptions class, provides a way to configure the import controls.
    /// </summary>
    public class ImportOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The path to the JSON file.
        /// </summary>
        /// <value></value>
        [Required]
        public string File { get; set; }

        /// <summary>
        /// get/set - The delay in seconds to wait before each separate request.
        /// </summary>
        /// <value></value>
        public int Delay { get; set; } = 0;

        /// <summary>
        /// get/set - The quantity of items to extract from the file and import in one single request.
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; } = 100;
        #endregion
    }
}
