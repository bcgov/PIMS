using System;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// StatusResponse class, provides a model that represents the status response.
    /// </summary>
    public class StatusResponse
    {
        #region Properties
        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        public Guid TransactionId { get; set; }

        /// <summary>
        /// get/set - The transaction Id to identify a group of messages.
        /// </summary>
        public Guid MessageId { get; set; }

        /// <summary>
        /// get/set - When the message was created.
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get/set - When the message has been schedule to be sent.
        /// </summary>
        public DateTime SendOn { get; set; }

        /// <summary>
        /// get/set - When the message was last updated.
        /// </summary>
        public DateTime UpdatedOn { get; set; }

        /// <summary>
        /// get/set - The current status of the message.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// get/set - A tag to identify related messages.
        /// </summary>
        public string Tag { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a StatusResponse class.
        /// </summary>
        public StatusResponse() { }

        /// <summary>
        /// Creates a new instance of a StatusResponse class, initializes with specified arguments.
        /// </summary>
        /// <param name="message"></param>
        public StatusResponse(Ches.Models.StatusResponseModel response)
        {
            this.TransactionId = response.TransactionId;
            this.MessageId = response.MessageId;
            this.CreatedOn = response.CreatedOn;
            this.SendOn = response.SendOn;
            this.UpdatedOn = response.UpdatedOn;
            this.Status = response.Status;
            this.Tag = response.Tag;
        }
        #endregion
    }
}
