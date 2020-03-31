using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.User.Resolvers
{
    /// <summary>
    /// KeycloakDisplayNameResolver class, provides a way for automapper to convert a keycloak display name attribute to a display name property.
    /// </summary>
    public class KeycloakDisplayNameResolver : IValueResolver<KModel.UserModel, Entity.User, string>
    {
        public string Resolve(KModel.UserModel source, Entity.User destination, string destMember, ResolutionContext context)
        {
            return source.Attributes?.ContainsKey("displayName") == true ? source.Attributes["displayName"].FirstOrDefault() : $"{source.LastName}, {source.FirstName}";
        }
    }
}
