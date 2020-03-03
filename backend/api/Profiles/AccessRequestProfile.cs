using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using System.Linq;

namespace Pims.Api.Helpers.Profiles
{
    public class AccessRequestProfile : Profile
    {
        #region Constructors
        public AccessRequestProfile()
        {
            CreateMap<Entity.AccessRequest, AccessRequestModel>();

            CreateMap<AccessRequestModel, Entity.AccessRequest>();
                
        }
        #endregion
    }
}
