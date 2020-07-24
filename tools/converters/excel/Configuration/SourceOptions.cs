using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// SourceOptions class, provides a way to configure the source conversion settings.
    /// </summary>
    public class SourceOptions
    {
        #region Properties
        /// <summary>
        /// get/set - A name to identify the source.  Should be unique.
        /// </summary>
        public string Name { get; set; }

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
        /// get/set - Whether the first row is a header column.
        /// </summary>
        public bool FirstRowIsHeaders { get; set; } = true;

        /// <summary>
        /// get/set - A dictionary to control the column configuration.
        /// </summary>
        public IDictionary<string, ColumnOptions> Columns { get; set; }

        /// <summary>
        /// get/set - Configuration optiosn for each row.
        /// </summary>
        public RowOptions Row { get; set; }
        #endregion
    }
}
