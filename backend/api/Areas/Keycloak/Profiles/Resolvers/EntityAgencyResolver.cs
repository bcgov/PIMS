using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// EntityAgencyResolver class, provides a way for automapper to convert a role to a group.
    /// </summary>
    public class EntityAgencyResolver : IValueResolver<Entity.User, KModel.UserModel, Dictionary<string, string[]>>
    {
        public Dictionary<string, string[]> Resolve(Entity.User source, KModel.UserModel destination, Dictionary<string, string[]> destMember, ResolutionContext context)
        {
            destMember["agencies"] = source.Agencies.Select(r => r.AgencyId.ToString()).ToArray();
            return destMember;
        }
    }
}
