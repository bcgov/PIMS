using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    /// <summary>
    /// MessageResponseModel class, provides a model that represents the response when a message was added to the CHES queue.
    /// </summary>
    public class MessageResponseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The message ID that uniquely identifies it.
        /// </summary>
        [JsonPropertyName("msgId")]
        public Guid MessageId { get; set; }

        /// <summary>
        /// get/set - The tag that provides a way to identify related messages.
        /// </summary>
        public string Tag { get; set; }

        /// <summary>
        /// get/set - An array of email addresses that the message was sent to.
        /// </summary>
        public IEnumerable<string> To { get; set; } = new List<string>();
        #endregion
    }
}
