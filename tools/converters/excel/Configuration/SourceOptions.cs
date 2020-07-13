using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// SourceOptions class, provides a way to configure the source conversion settings.
    /// </summary>
    public class SourceOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The path to the JSON file.
        /// </summary>
        /// <value></value>
        [Required]
        public string File { get; set; }

        /// <summary>
        /// get/set - The path and file name of the converted result.
        /// </summary>
        public string Output { get; set; }

        /// <summary>
        /// get/set - The name of the sheet to convert.
        /// </summary>
        public string SheetName { get; set; }

        /// <summary>
        /// get/set - A dictionary to control the column configuration.
        /// </summary>
        public IDictionary<string, ColumnOptions> Columns { get; set; }
        #endregion
    }
}
