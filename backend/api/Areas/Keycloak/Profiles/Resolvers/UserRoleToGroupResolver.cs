using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// UserRoleToGroupResolver class, provides a way for automapper to convert user roles to groups.
    /// </summary>
    public class UserRoleToGroupResolver : IValueResolver<Entity.User, Model.UserModel, IEnumerable<Model.GroupModel>>
    {
        public IEnumerable<Model.GroupModel> Resolve(Entity.User source, Model.UserModel destination, IEnumerable<Model.GroupModel> destMember, ResolutionContext context)
        {
            return source.Roles.Select(r => new Model.GroupModel()
            {
                Id = r.RoleId,
                Name = r.Role?.Name,
                Description = r.Role?.Description,
                CreatedOn = r.Role?.CreatedOn ?? new DateTime(),
                UpdatedOn = r.Role?.UpdatedOn,
                RowVersion = r.Role == null ? null : Convert.ToBase64String(r.Role.RowVersion)
            });
        }
    }
}
