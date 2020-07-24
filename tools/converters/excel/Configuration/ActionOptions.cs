namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// ActionOptions class, provides a way to configure the an action to perform.
    /// </summary>
    public class ActionOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The column that this action will be performed on.
        /// </summary>
        public string Column { get; set; }

        /// <summary>
        /// get/set - The name of the converter to use when extracting the value.
        /// </summary>
        public string Converter { get; set; }

        /// <summary>
        /// get/set - An array of columns names to pull values from to pass as arguments to the converter.
        /// The order must batch the converter function arguments order.
        /// </summary>
        public ActionArgumentOptions[] ConverterArgs { get; set; }
        #endregion
    }
}
