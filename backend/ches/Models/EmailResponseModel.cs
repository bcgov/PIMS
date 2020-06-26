using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailResponseModel class, provides a model that represents the response when an email has been sent to CHES.
    /// </summary>
    public class EmailResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The transaction ID to identify a group of messages.
        /// </summary>
        [JsonPropertyName("txId")]
        public Guid TransactionId { get; set; }

        /// <summary>
        /// get/set - An array of messages that were sent.
        /// </summary>
        public IEnumerable<MessageResponseModel> Messages { get; set; } = new List<MessageResponseModel>();
        public bool Message { get; set; }
        #endregion
    }
}
