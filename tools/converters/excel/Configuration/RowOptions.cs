namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// RowOptions class, provides a way to configure the row conversion settings.
    /// </summary>
    public class RowOptions
    {
        #region Properties
        /// <summary>
        /// get/set - An array of actions to perform after a row is converted.
        /// </summary>
        public ActionOptions[] PostActions { get; set; }
        #endregion
    }
}
