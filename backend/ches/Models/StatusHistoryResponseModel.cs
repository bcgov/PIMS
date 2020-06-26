using Pims.Core.Converters;
using System;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// StatusHistoryResponseModel class, provides a model that represents the status history of a message.
    /// </summary>
    public class StatusHistoryResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the status.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The status.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - When the status was set.
        /// </summary>
        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        public DateTime Timestamp { get; set; }
        #endregion
    }
}
