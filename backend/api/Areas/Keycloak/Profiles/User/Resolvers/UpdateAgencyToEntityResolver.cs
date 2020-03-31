using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models.User;

namespace Pims.Api.Areas.Keycloak.Profiles.User.Resolvers
{
    /// <summary>
    /// UpdateAgencyToEntityResolver class, provides automapper configuration to convert entiy agencies to model agencies.
    /// </summary>
    public class UpdateAgencyToEntityResolver : IValueResolver<Model.Update.UserModel, Entity.User, ICollection<Entity.UserAgency>>
    {
        public ICollection<Entity.UserAgency> Resolve(Model.Update.UserModel source, Entity.User destination, ICollection<Entity.UserAgency> destMember, ResolutionContext context)
        {
            if (destMember == null) destMember = new List<Entity.UserAgency>();

            foreach (var agency in source.Agencies)
            {
                var existing = destMember.FirstOrDefault(a => a.AgencyId == agency.Id);
                if (existing == null)
                {
                    destMember.Add(new Entity.UserAgency()
                    {
                        UserId = destination.Id,
                        AgencyId = agency.Id
                    });
                }
            }

            return destMember;
        }
    }
}
