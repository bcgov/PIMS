using System.ComponentModel.DataAnnotations;

namespace Pims.Tools.Import
{
    /// <summary>
    /// ImportOptions class, provides a way to configure the import controls.
    /// </summary>
    public class ImportOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The path to the JSON file.
        /// </summary>
        /// <value></value>
        [Required]
        public string File { get; set; }

        /// <summary>
        /// get/set - The delay in seconds to wait before each separate request.
        /// </summary>
        /// <value></value>
        public int Delay { get; set; } = 0;

        /// <summary>
        /// get/set - The quantity of items to extract from the file and import in one single request.
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; } = 100;

        /// <summary>
        /// get/set - The number of items to skip in the imported JSON array.
        /// </summary>
        /// <value></value>
        public int Skip { get; set; } = 0;

        /// <summary>
        /// get/set - The number of requests to make before cancelling the import (default = 0, which means don't stop)
        /// </summary>
        /// <value></value>
        public int Iterations { get; set; } = 0;

        /// <summary>
        /// get/set - Whether to retry a request after a failure.
        /// </summary>
        /// <value></value>
        public bool RetryAfterFailure { get; set; } = true;

        /// <summary>
        /// get/set - How many retries after a failure should be sent.
        /// </summary>
        /// <value></value>
        public int RetryAttempts { get; set; } = 3;

        /// <summary>
        /// get/set - After how many failures should the import be aborted.
        /// </summary>
        /// <value></value>
        public int AbortAfterFailure { get; set; } = 1;
        #endregion
    }
}
