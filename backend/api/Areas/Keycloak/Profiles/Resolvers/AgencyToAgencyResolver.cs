using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// AgencyToAgencyResolver class, provides automapper configuration to convert entiy agencies to model agencies.
    /// </summary>
    public class AgencyToAgencyResolver : IValueResolver<Entity.User, Model.UserModel, IEnumerable<Model.AgencyModel>>
    {
        public IEnumerable<Model.AgencyModel> Resolve(Entity.User source, Model.UserModel destination, IEnumerable<Model.AgencyModel> destMember, ResolutionContext context)
        {
            return source.Agencies?.Select(a => new Model.AgencyModel()
            {
                Id = a.AgencyId,
                Name = a.Agency?.Name,
                Code = a.Agency?.Code,
                Description = a.Agency?.Description,
                ParentId = a.Agency?.ParentId,
                CreatedOn = a.Agency?.CreatedOn ?? new DateTime(),
                UpdatedOn = a.Agency?.UpdatedOn,
                RowVersion = a.Agency == null ? null : Convert.ToBase64String(a.Agency.RowVersion)
            }) ?? new Model.AgencyModel[0];
        }
    }
}
