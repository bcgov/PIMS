namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// ConvertWhenOption enum, provides a way to configure when a column should be converted.
    /// </summary>
    public enum ConvertWhenOption
    {
        /// <summary>
        /// Run the provided converter.
        /// </summary>
        Always = 0,
        /// <summary>
        /// When the value is null.
        /// </summary>
        Null = 1,
        /// <summary>
        /// When the value is null or empty.
        /// </summary>
        NullOrEmpty = 2,
        /// <summary>
        /// When the value is null, empty or whitespace.
        /// </summary>
        NullOrWhitespace = 3,
        /// <summary>
        /// The value is the default for the type.
        /// </summary>
        Default = 4,
        /// <summary>
        /// The value is null or the default for the type.
        /// </summary>
        NullOrDefault = 5,
        /// <summary>
        /// The value is null.
        /// </summary>
        NotNull = 6
    }
}
