using AutoMapper;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class AgencyProfile : Profile
    {
        #region Constructors
        public AgencyProfile()
        {
            CreateMap<Entity.Agency, AgencyModel>()
                .IncludeBase<Entity.CodeEntity, CodeModel>();

            CreateMap<AgencyModel, Entity.Agency>()
                .IncludeBase<CodeModel, Entity.CodeEntity>();
        }
        #endregion
    }
}
