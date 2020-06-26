namespace Pims.Ches.Models
{
    /// <summary>
    /// ErrorModel class, provides a model that represents an error detail.
    /// </summary>
    public class ErrorModel
    {
        #region Properties
        /// <summary>
        /// get/set - The error message.
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// get/set - The error object value.
        /// </summary>
        public object Value { get; set; }
        #endregion
    }
}
