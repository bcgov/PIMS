using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// UpdateRoleToEntityResolver class, provides automapper configuration to convert entiy agencies to model agencies.
    /// </summary>
    public class UpdateRoleToEntityResolver : IValueResolver<Model.Update.UserModel, Entity.User, ICollection<Entity.UserRole>>
    {
        public ICollection<Entity.UserRole> Resolve(Model.Update.UserModel source, Entity.User destination, ICollection<Entity.UserRole> destMember, ResolutionContext context)
        {
            return source.Roles.Select(r => new Entity.UserRole()
            {
                RoleId = r.Id,
                UserId = destination.Id
            }).ToList();
        }
    }
}
