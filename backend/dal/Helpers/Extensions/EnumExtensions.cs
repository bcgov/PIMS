using Pims.Dal.Security;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// EnumExtensions static class, provides extension methods for enum values.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        /// Get the Keycloak name value of the specified permission.
        /// </summary>
        /// <param name="permission"></param>
        /// <returns></returns>
        public static string GetName(this Permissions permission)
        {
            var enumType = typeof(Permissions);
            var memberInfos = enumType.GetMember(permission.ToString());
            var enumValueMemberInfo = memberInfos.FirstOrDefault(m => m.DeclaringType == enumType);
            var attribute = (DisplayAttribute)enumValueMemberInfo.GetCustomAttributes(typeof(DisplayAttribute), false).FirstOrDefault();
            return attribute.Name;
        }
    }
}
