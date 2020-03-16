using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using KModel = Pims.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles.Resolvers
{
    /// <summary>
    /// AttributeMapToAgencyResolver class, provides automapper a way to covert the user attribute 'agencies' to a list of agencies.
    /// </summary>
    public class AttributeMapToAgencyResolver : IValueResolver<KModel.UserModel, Entity.User, ICollection<Entity.UserAgency>>
    {
        public ICollection<Entity.UserAgency> Resolve(KModel.UserModel source, Entity.User destination, ICollection<Entity.UserAgency> destMember, ResolutionContext context)
        {
            if (source.Attributes?.ContainsKey("agencies") ?? false)
            {
                return source.Attributes["agencies"].Select(a =>
                {
                    if (int.TryParse(a, out int id))
                        return new Entity.UserAgency(source.Id, id);
                    return null;
                }).Where(a => a != null).ToList();
            }

            return new List<Entity.UserAgency>();
        }
    }
}
