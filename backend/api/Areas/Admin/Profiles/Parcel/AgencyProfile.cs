using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Profiles.Parcel
{
    /// <summary>
    /// AgencyProfile class, provides a way to configure automapper to convert agencies.
    /// </summary>
    public class AgencyProfile : Profile
    {
        #region Constructors
        public AgencyProfile()
        {
            CreateMap<Entity.Agency, Model.AgencyModel>();

            CreateMap<Model.AgencyModel, Entity.Agency>()
                .ForMember(dest => dest.Parent, opt => opt.Ignore())
                .ForMember(dest => dest.IsDisabled, opt => opt.Ignore())
                .ForMember(dest => dest.SortOrder, opt => opt.Ignore());
        }
        #endregion
    }
}
