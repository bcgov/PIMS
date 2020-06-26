using System;
using System.Collections.Generic;

namespace Pims.Ches.Models
{
    public interface IEmail
    {
        string From { get; set; }
        IEnumerable<string> To { get; set; }
        IEnumerable<string> Cc { get; set; }
        IEnumerable<string> Bcc { get; set; }
        EmailBodyTypes BodyType { get; set; }
        EmailEncodings Encoding { get; set; }
        EmailPriorities Priority { get; set; }
        string Subject { get; set; }
        string Body { get; set; }
        string Tag { get; set; }
        DateTime SendOn { get; set; }

        IEnumerable<IAttachment> Attachments { get; set; }
    }
}
