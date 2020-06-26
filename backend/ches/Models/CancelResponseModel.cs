using System;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// CancelResponseModel class, provides a model that represents the response when cancelling a message.
    /// </summary>
    public class CancelResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The message ID that uniquely identifies the message.
        /// </summary>
        [JsonPropertyName("msgId")]
        public Guid MessageId { get; set; }

        /// <summary>
        /// get/set - The transaction ID that identifies a group of messages.
        /// </summary>
        [JsonPropertyName("txId")]
        public Guid TransactionId { get; set; }

        /// <summary>
        /// get/set - The status of the message.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - A tag to identify related messages.
        /// </summary>
        public string Tag { get; set; }
        #endregion
    }
}
