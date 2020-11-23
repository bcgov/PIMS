namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// ActionArgumentOptions class, provides a way to configure the an action to perform.
    /// </summary>
    public class ActionArgumentOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The column that this action will be performed on.
        /// Use an '*' asterix to use the source column.
        /// </summary>
        public string Column { get; set; }

        /// <summary>
        /// get/set - The value to use.
        /// </summary>
        public string Value { get; set; }
        #endregion
    }
}
