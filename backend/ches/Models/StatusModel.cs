using System;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    public class StatusModel
    {
        #region Properties
        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        [JsonPropertyName("txId")]
        public Guid? TransactionId { get; set; }

        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        [JsonPropertyName("msgId")]
        public Guid? MessageId { get; set; }

        /// <summary>
        /// get/set - The status of the message.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - A tag to identify a related message.
        /// </summary>
        public string Tag { get; set; }
        #endregion
    }
}
