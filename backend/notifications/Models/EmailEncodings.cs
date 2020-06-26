using Pims.Core.Json;

namespace Pims.Notifications.Models
{
    /// <summary>
    /// EmailEncodings enum, provides notification encoding options.
    /// </summary>
    public enum EmailEncodings
    {
        [EnumValue("utf-8")]
        Utf8 = 0,
        Base64 = 1,
        Binary = 2,
        Hex = 3
    }
}
