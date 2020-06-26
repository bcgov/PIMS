using System.Collections.Generic;

namespace Pims.Ches.Models
{
    /// <summary>
    /// ErrorResponseModel class, provides a model that represents an error returned from CHES.
    /// </summary>
    public class ErrorResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The error type.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// get/set - The error title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// get/set - The error status.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - The error details.
        /// </summary>
        public string Detail { get; set; }

        /// <summary>
        /// get/set - An array of error messages.
        /// </summary>
        public IEnumerable<ErrorModel> Errors { get; set; } = new List<ErrorModel>();
        #endregion
    }
}
