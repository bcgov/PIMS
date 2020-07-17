using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// ValueSwitchOptions class, provides a way to configure how the Excel columsn are converted to JSON.
    /// </summary>
    public class ValueSwitchOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The search criteria can be a regex expression.
        /// </summary>
        /// <value></value>
        [Required]
        public string Search { get; set; }

        /// <summary>
        /// get/set - The value to set.
        /// </summary>
        public string Value { get; set; }
        #endregion
    }
}
