namespace Pims.Tools.Converters.ExcelConverter.Configuration
{
    /// <summary>
    /// SkipOption enum, provides a way to configure when a column should be skipped.
    /// This will not set the value, and therefore the value will be the true default or a value set in another operation.
    /// </summary>
    public enum SkipOption
    {
        /// <summary>
        /// Never skip the column.
        /// </summary>
        Never = 0,
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
        /// The value has already been set by a prior operation.
        /// </summary>
        AlreadySet = 4,
        /// <summary>
        /// Always skip this column.
        /// </summary>
        Always = 5
    }
}
