using Pims.Core.Json;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// NotificationEncodings enum, provides notification encoding options.
    /// </summary>
    public enum NotificationEncodings
    {
        [EnumValue("utf-8")]
        Utf8 = 0,
        Base64 = 1,
        Binary = 2,
        Hex = 3
    }
}
