using AutoMapper;
using Model = Pims.Api.Models.User;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Profiles.User
{
    public class AgencyProfile : Profile
    {
        #region Constructors
        public AgencyProfile()
        {
            CreateMap<Entity.Agency, Model.AgencyModel>()
                .IncludeBase<Entity.CodeEntity, Pims.Api.Models.CodeModel>();

            CreateMap<Model.AgencyModel, Entity.Agency>()
                .IncludeBase<Pims.Api.Models.CodeModel, Entity.CodeEntity>();
        }
        #endregion
    }
}
