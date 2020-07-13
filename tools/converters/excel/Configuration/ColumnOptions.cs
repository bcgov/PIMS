using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// ColumnOptions class, provides a way to configure how the Excel columsn are converted to JSON.
    /// </summary>
    public class ColumnOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The name of the column
        /// </summary>
        /// <value></value>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// get/set - The system type of the column value.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// get/set - The name of the converter to use when extracting the value.
        /// </summary>
        public string Converter { get; set; }

        /// <summary>
        /// get/set - The default value if none is provided.
        /// </summary>
        public object DefaultValue { get; set; }

        /// <summary>
        /// get/set - A way to switch values from the source to something else.
        /// </summary>
        public IEnumerable<ValueSwitchOptions> ValueSwitch { get; set; }
        #endregion
    }
}
