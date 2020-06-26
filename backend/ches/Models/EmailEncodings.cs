using Pims.Core.Json;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailEncodings enum, provides notification encoding options.
    /// </summary>
    public enum EmailEncodings
    {
        [EnumValue("utf-8")]
        Utf8 = 0,
        [EnumValue("base64")]
        Base64 = 1,
        [EnumValue("binary")]
        Binary = 2,
        [EnumValue("hex")]
        Hex = 3
    }
}
