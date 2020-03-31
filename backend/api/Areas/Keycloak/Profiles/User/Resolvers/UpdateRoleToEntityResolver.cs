using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Profiles.User.Resolvers
{
    /// <summary>
    /// UpdateRoleToEntityResolver class, provides automapper configuration to convert entiy agencies to model agencies.
    /// </summary>
    public class UpdateRoleToEntityResolver : IValueResolver<Model.Update.UserModel, Entity.User, ICollection<Entity.UserRole>>
    {
        public ICollection<Entity.UserRole> Resolve(Model.Update.UserModel source, Entity.User destination, ICollection<Entity.UserRole> destMember, ResolutionContext context)
        {
            if (destMember == null) destMember = new List<Entity.UserRole>();

            foreach (var role in source.Roles)
            {
                var existing = destMember.FirstOrDefault(a => a.RoleId == role.Id);
                if (existing == null)
                {
                    destMember.Add(new Entity.UserRole()
                    {
                        UserId = destination.Id,
                        RoleId = role.Id
                    });
                }
            }

            return destMember;
        }
    }
}
