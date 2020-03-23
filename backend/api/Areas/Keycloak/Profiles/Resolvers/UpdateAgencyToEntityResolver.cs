using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// UpdateAgencyToEntityResolver class, provides automapper configuration to convert entiy agencies to model agencies.
    /// </summary>
    public class UpdateAgencyToEntityResolver : IValueResolver<Model.Update.UserModel, Entity.User, ICollection<Entity.UserAgency>>
    {
        public ICollection<Entity.UserAgency> Resolve(Model.Update.UserModel source, Entity.User destination, ICollection<Entity.UserAgency> destMember, ResolutionContext context)
        {
            return source.Agencies.Select(a => new Entity.UserAgency()
            {
                AgencyId = a.Id,
                UserId = destination.Id
            }).ToList();
        }
    }
}
