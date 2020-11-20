using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Converters.ExcelConverter.Configuration
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
        /// get/set - Control when the converter will be used.
        /// </summary>
        public ConvertWhenOption ConvertWhen { get; set; }

        /// <summary>
        /// get/set - The name of the converter to use when extracting the value.
        /// </summary>
        public string Converter { get; set; }

        /// <summary>
        /// get/set - An array of columns names to pull values from to pass as arguments to the converter.
        /// The order must batch the converter function arguments order.
        /// </summary>
        public ActionArgumentOptions[] ConverterArgs { get; set; }

        /// <summary>
        /// get/set - The default value if none is provided.
        /// </summary>
        public object DefaultValue { get; set; }

        /// <summary>
        /// get/set - A way to switch values from the source to something else.
        /// </summary>
        public IEnumerable<ValueSwitchOptions> ValueSwitch { get; set; }

        /// <summary>
        /// get/set - When this column should be skpped.
        /// </summary>
        public SkipOption Skip { get; set; } = SkipOption.Never;

        /// <summary>
        /// get/set - An array of columns this value should be outputted to.
        /// The order generally is only important if the converter returns a tuple.
        /// </summary>
        public string[] OutputTo { get; set; }

        /// <summary>
        /// get/set - Whether the output should be to an array.
        /// </summary>
        public bool OutputToArray { get; set; }
        #endregion
    }
}
