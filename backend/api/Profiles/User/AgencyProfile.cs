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

            CreateMap<Entity.AccessRequestAgency, Model.AgencyModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AgencyId))
                .ForMember(dest => dest.Code, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Agency.Description))
                .ForMember(dest => dest.IsDisabled, opt => opt.MapFrom(src => src.Agency.IsDisabled))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Agency.Name))
                .ForMember(dest => dest.SortOrder, opt => opt.MapFrom(src => src.Agency.SortOrder))
                .ForMember(dest => dest.Children, opt => opt.Ignore())
                .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.Agency.Parent))
                .ForMember(dest => dest.Users, opt => opt.Ignore())
                .IncludeBase<Entity.BaseEntity, Pims.Api.Models.BaseModel>();
        }
        #endregion
    }
}
