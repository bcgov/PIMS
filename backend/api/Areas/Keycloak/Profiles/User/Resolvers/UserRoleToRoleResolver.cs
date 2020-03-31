using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Profiles.User.Resolvers
{
    /// <summary>
    /// UserRoleToRoleResolver class, provides a way for automapper to convert user roles to groups.
    /// </summary>
    public class UserRoleToRoleResolver : IValueResolver<Entity.User, Model.UserModel, IEnumerable<Model.RoleModel>>
    {
        public IEnumerable<Model.RoleModel> Resolve(Entity.User source, Model.UserModel destination, IEnumerable<Model.RoleModel> destMember, ResolutionContext context)
        {
            return source.Roles?.Select(r => new Model.RoleModel()
            {
                Id = r.RoleId.ToString(),
                Name = r.Role?.Name,
                Description = r.Role?.Description,
                CreatedOn = r.Role?.CreatedOn ?? new DateTime(),
                UpdatedOn = r.Role?.UpdatedOn,
                RowVersion = r.Role == null ? null : Convert.ToBase64String(r.Role.RowVersion)
            }) ?? new Model.RoleModel[0];
        }
    }
}
