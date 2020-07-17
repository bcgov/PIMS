using System.Collections.Generic;

namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// ConverterOptions class, provides a way to configure the converter settings.
    /// </summary>
    public class ConverterOptions
    {
        #region Properties
        /// <summary>
        /// get/set - An array of source names to run.  If empty, all will be run.
        /// </summary>
        public string[] Run { get; set; }

        /// <summary>
        /// get/set - A dictionary of sources that will be converted.
        /// </summary>
        public IEnumerable<SourceOptions> Sources { get; set; }
        #endregion
    }
}
