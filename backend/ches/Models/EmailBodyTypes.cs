using Pims.Core.Json;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailBodyTypes enum, provides email body type options.
    /// </summary>
    public enum EmailBodyTypes
    {
        [EnumValue("html")]
        Html = 0,
        [EnumValue("text")]
        Text = 1
    }
}
