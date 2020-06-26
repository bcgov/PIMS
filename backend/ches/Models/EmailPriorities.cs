using Pims.Core.Json;

namespace Pims.Ches.Models
{
    /// <summary>
    /// EmailPriorities enum, provides email priority options.
    /// </summary>
    public enum EmailPriorities
    {
        [EnumValue("low")]
        Low = 0,
        [EnumValue("normal")]
        Normal = 1,
        [EnumValue("high")]
        High = 2
    }
}
