using System;
using AutoMapper;
using backend.Helpers.Profiles.Converters;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles
{
    public class ParcelProfile : Profile
    {
        #region Constructors
        public ParcelProfile()
        {
            CreateMap<Entity.Parcel, Model.Parts.ParcelModel>();

            CreateMap<Model.Parts.ParcelModel, Entity.Parcel>()
                .ForMember(dest => dest.PID, opt => opt.Ignore())
                .ForMember(dest => dest.ParcelId, opt => opt.ConvertUsing(new ParcelIdConverter()))
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Classification, opt => opt.Ignore());

            CreateMap<Entity.Parcel, Model.ParcelModel>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.Name))
                .ForMember(dest => dest.Classification, opt => opt.MapFrom(src => src.Classification.Name))
                .ForMember(dest => dest.Agency, opt => opt.ConvertUsing(new ParcelAgencyConverter()))
                .ForMember(dest => dest.SubAgency, opt => opt.MapFrom<ParcelSubAgencyResolver>());

            CreateMap<Model.ParcelModel, Entity.Parcel>()
                .ForMember(dest => dest.PID, opt => opt.Ignore())
                .ForMember(dest => dest.ParcelId, opt => opt.MapFrom<ParcelIdResolver>())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Classification, opt => opt.Ignore())
                .ForMember(dest => dest.Agency, opt => opt.Ignore())
                .ForMember(dest => dest.AddressId, opt => opt.MapFrom(src => src.Address.Id))
                .ForMember(dest => dest.Buildings, opt => opt.Ignore());
        }
        #endregion
    }
}
