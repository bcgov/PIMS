using Pims.Core.Converters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// StatusResponseModel class, provides a model that represents the status response.
    /// </summary>
    public class StatusResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        [JsonPropertyName("txId")]
        public Guid TransactionId { get; set; }

        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        [JsonPropertyName("msgId")]
        public Guid MessageId { get; set; }

        /// <summary>
        /// get/set - When the message was created.
        /// </summary>
        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        [JsonPropertyName("createdTS")]
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get/set - When the message has been schedule to be sent.
        /// </summary>
        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        [JsonPropertyName("delayTS")]
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - When the message was last updated.
        /// </summary>
        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        [JsonPropertyName("updatedTS")]
        public DateTime UpdatedOn { get; set; }

        /// <summary>
        /// get/set - The current status of the message.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - A tag to identify related messages.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - An array of status history of the message.
        /// </summary>
        public IEnumerable<StatusHistoryResponseModel> StatusHistory { get; set; } = new List<StatusHistoryResponseModel>();
        #endregion
    }
}
