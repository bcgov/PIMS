using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Notifications.Models
{
    public class MessageResponse
    {
        #region Properties
        /// <summary>
        /// get/set - The message ID that uniquely identifies it.
        /// </summary>
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

        #region Constructors
        /// <summary>
        /// Creates a new instance of a MessageResponse class.
        /// </summary>
        public MessageResponse() { }

        /// <summary>
        /// Creates a new instance of a MessageResponse class, initializes with specified arguments.
        /// </summary>
        /// <param name="message"></param>
        public MessageResponse(Ches.Models.MessageResponseModel message)
        {
            this.MessageId = message.MessageId;
            this.Tag = message.Tag;

            if (message.To?.Any() ?? false) ((List<string>)this.To).AddRange(message.To);
        }
        #endregion
    }
}
