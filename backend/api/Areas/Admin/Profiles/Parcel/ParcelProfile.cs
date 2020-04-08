using AutoMapper;
using BModel = Pims.Api.Models;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;
using Pims.Api.Profiles.Converters;
using Pims.Api.Helpers.Extensions;
using Pims.Api.Areas.Admin.Profiles.Parcel.Resolvers;

namespace Pims.Api.Areas.Admin.Profiles.Parcel
{
    public class ParcelProfile : Profile
    {
        #region Constructors
        public ParcelProfile()
        {
            CreateMap<Entity.Parcel, Model.PartialParcelModel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity));

            CreateMap<Model.PartialParcelModel, Entity.Parcel>()
                .IgnoreAllUnmapped()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ParcelIdentity, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.StatusId))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.ClassificationId, opt => opt.MapFrom(src => src.ClassificationId))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.Zoning, opt => opt.MapFrom(src => src.Zoning))
                .ForMember(dest => dest.ZoningPotential, opt => opt.MapFrom(src => src.ZoningPotential))
                .ForMember(dest => dest.PID, opt => opt.ConvertUsing(new ParcelIdConverter(), src => src.PID))
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();

            CreateMap<Entity.Parcel, Model.ParcelModel>()
                .ForMember(dest => dest.PID, opt => opt.MapFrom(src => src.ParcelIdentity))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.Name))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Classification, opt => opt.MapFrom(src => src.Classification.Name))
                .ForMember(dest => dest.Agency, opt => opt.MapFrom(src => src.Agency))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.LandArea, opt => opt.MapFrom(src => src.LandArea))
                .ForMember(dest => dest.LandLegalDescription, opt => opt.MapFrom(src => src.LandLegalDescription))
                .ForMember(dest => dest.Municipality, opt => opt.MapFrom(src => src.Municipality))
                .ForMember(dest => dest.Zoning, opt => opt.MapFrom(src => src.Zoning))
                .ForMember(dest => dest.ZoningPotential, opt => opt.MapFrom(src => src.ZoningPotential))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Agency, opt => opt.ConvertUsing(new ParcelAgencyConverter()))
                .ForMember(dest => dest.SubAgency, opt => opt.MapFrom<ParcelSubAgencyResolver>())
                .IncludeBase<Entity.BaseEntity, BModel.BaseModel>();

            CreateMap<Model.ParcelModel, Entity.Parcel>()
                .ForMember(dest => dest.PID, opt => opt.ConvertUsing(new ParcelIdConverter(), src => src.PID))
                .ForMember(dest => dest.ParcelIdentity, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.Classification, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
                .ForMember(dest => dest.LandArea, opt => opt.MapFrom(src => src.LandArea))
                .ForMember(dest => dest.LandLegalDescription, opt => opt.MapFrom(src => src.LandLegalDescription))
                .ForMember(dest => dest.Municipality, opt => opt.MapFrom(src => src.Municipality))
                .ForMember(dest => dest.Zoning, opt => opt.MapFrom(src => src.Zoning))
                .ForMember(dest => dest.ZoningPotential, opt => opt.MapFrom(src => src.ZoningPotential))
                .ForMember(dest => dest.IsSensitive, opt => opt.MapFrom(src => src.IsSensitive))
                .ForMember(dest => dest.Buildings, opt => opt.Ignore())
                .ForMember(dest => dest.Evaluations, opt => opt.Ignore())
                .IncludeBase<BModel.BaseModel, Entity.BaseEntity>();
        }
        #endregion
    }
}
