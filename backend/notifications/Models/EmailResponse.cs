using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// EmailResponse class, provides a model that represents an email response.
    /// </summary>
    public class EmailResponse
    {
        #region Properties
        public Guid TransactionId { get; set; }
        public IEnumerable<MessageResponse> Messages { get; set; } = new List<MessageResponse>();
        #endregion

        #region Constructors
        public EmailResponse()
        {

        }

        public EmailResponse(Ches.Models.EmailResponseModel response)
        {
            this.TransactionId = response.TransactionId;

            if (response.Messages?.Any() ?? false)
            {
                ((List<MessageResponse>)this.Messages).AddRange(response.Messages.Select(m => new MessageResponse(m)));
            }
        }
        #endregion
    }
}
