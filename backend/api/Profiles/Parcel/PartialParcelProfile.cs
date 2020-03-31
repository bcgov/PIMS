using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Parcel;
using Pims.Api.Profiles.Converters;
using Pims.Api.Helpers.Extensions;

namespace Pims.Api.Profiles.Parcel
{
    public class PartialParcelProfile : Profile
    {
        #region Constructors
        public PartialParcelProfile()
        {
            CreateMap<Entity.Parcel, Model.PartialParcelModel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity));

            CreateMap<Model.PartialParcelModel, Entity.Parcel>()
                .IgnoreAllUnmapped()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ParcelIdentity, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.StatusId))
                .ForMember(dest => dest.ClassificationId, opt => opt.MapFrom(src => src.ClassificationId))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.PID, opt => opt.ConvertUsing(new ParcelIdConverter(), src => src.PID))
                .IncludeBase<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
