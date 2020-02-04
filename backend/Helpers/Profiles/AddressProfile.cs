using System;
using AutoMapper;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Areas.Admin.Models;

namespace Pims.Api.Helpers.Profiles
{
    public class AddressProfile : Profile
    {
        #region Constructors
        public AddressProfile()
        {
            CreateMap<Entity.Address, Model.AddressModel>()
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City.Name))
                .ForMember(dest => dest.Province, opt => opt.MapFrom(src => src.Province.Name))
                .ForMember(dest => dest.Line1, opt => opt.MapFrom(src => src.Address1))
                .ForMember(dest => dest.Line2, opt => opt.MapFrom(src => src.Address2));

            CreateMap<Model.AddressModel, Entity.Address>()
                .ForMember(dest => dest.City, opt => opt.Ignore())
                .ForMember(dest => dest.Province, opt => opt.Ignore())
                .ForMember(dest => dest.Address1, opt => opt.MapFrom(src => src.Line1))
                .ForMember(dest => dest.Address2, opt => opt.MapFrom(src => src.Line2));
        }
        #endregion
    }
}
