using AutoMapper;
using Pims.Api.Helpers.Profiles.Converters;
using Pims.Api.Models;
using Pims.Api.Profiles.Extensions;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Helpers.Profiles
{
    public class ParcelProfile : Profile
    {
        #region Constructors
        public ParcelProfile()
        {
            CreateMap<Entity.Parcel, Models.Parts.ParcelModel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity));

            CreateMap<Models.Parts.ParcelModel, Entity.Parcel>()
                .IgnoreAllUnmapped()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ParcelIdentity, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.StatusId))
                .ForMember(dest => dest.ClassificationId, opt => opt.MapFrom(src => src.ClassificationId))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.PID, opt => opt.ConvertUsing(new ParcelIdConverter(), src => src.PID))
                .IncludeBase<BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Parcel, Models.ParcelModel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.Name))
                .ForMember(dest => dest.Classification, opt => opt.MapFrom(src => src.Classification.Name))
                .ForMember(dest => dest.Agency, opt => opt.ConvertUsing(new ParcelAgencyConverter()))
                .ForMember(dest => dest.SubAgency, opt => opt.MapFrom<ParcelSubAgencyResolver>())
                .IncludeBase<Entity.BaseEntity, BaseModel>();

            CreateMap<Models.ParcelModel, Entity.Parcel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom<ParcelIdResolver>())
                .ForMember(dest => dest.ParcelIdentity, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Classification, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Buildings, opt => opt.Ignore())
                .ForMember(dest => dest.Evaluations, opt => opt.Ignore())
                .IncludeBase<BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
