using System.Linq;
using Pims.Dal.Security;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// EnumExtensions static class, provides extension methods for enum values.
    /// </summary>
    public static class EnumExtensions
    {
        /// <summary>
        /// Get the Keycloak name value of the specified claim.
        /// </summary>
        /// <param name="claim"></param>
        /// <returns></returns>
        public static string GetRoleName(this RoleClaim claim)
        {
            var enumType = typeof(RoleClaim);
            var memberInfos = enumType.GetMember(claim.ToString());
            var enumValueMemberInfo = memberInfos.FirstOrDefault(m => m.DeclaringType == enumType);
            var attribute = (ClaimNameAttribute) enumValueMemberInfo.GetCustomAttributes(typeof(ClaimNameAttribute), false).FirstOrDefault();
            return attribute.Name;
        }
    }
}
