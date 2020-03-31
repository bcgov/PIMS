using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.User.Resolvers
{
    /// <summary>
    /// EntityRoleResolver class, provides a way for automapper to convert a role to a group.
    /// </summary>
    public class EntityRoleResolver : IValueResolver<Entity.User, KModel.UserModel, string[]>
    {
        public string[] Resolve(Entity.User source, KModel.UserModel destination, string[] destMember, ResolutionContext context)
        {
            return source.Roles.Select(r => r.RoleId.ToString()).ToArray();
        }
    }
}
