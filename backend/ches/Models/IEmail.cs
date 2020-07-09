using Pims.Core.Converters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    public interface IEmail
    {
        string From { get; set; }
        IEnumerable<string> To { get; set; }
        IEnumerable<string> Cc { get; set; }
        IEnumerable<string> Bcc { get; set; }

        [JsonConverter(typeof(EnumValueJsonConverter<EmailBodyTypes>))]
        EmailBodyTypes BodyType { get; set; }

        [JsonConverter(typeof(EnumValueJsonConverter<EmailEncodings>))]
        EmailEncodings Encoding { get; set; }

        [JsonConverter(typeof(EnumValueJsonConverter<EmailPriorities>))]
        EmailPriorities Priority { get; set; }
        string Subject { get; set; }
        string Body { get; set; }
        string Tag { get; set; }

        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        [JsonPropertyName("delayTS")]
        DateTime SendOn { get; set; }

        IEnumerable<IAttachment> Attachments { get; set; }
    }
}
