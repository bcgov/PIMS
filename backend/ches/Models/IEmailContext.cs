using Pims.Core.Converters;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Pims.Ches.Models
{
    public interface IEmailContext
    {
        IEnumerable<string> Bcc { get; set; }
        IEnumerable<string> Cc { get; set; }
        object Context { get; set; }

        [JsonConverter(typeof(MicrosecondEpochJsonConverter))]
        [JsonPropertyName("delayTS")]
        DateTime SendOn { get; set; }

        string Tag { get; set; }
        IEnumerable<string> To { get; set; }
    }
}
