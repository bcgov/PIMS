using Mapster;
using System;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Tools.Models.Import;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class AddressMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Address, Model.AddressModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Line1, src => src.Address1)
                .Map(dest => dest.Line2, src => src.Address2)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.ProvinceId, src => src.ProvinceId)
                .Map(dest => dest.Province, src => src.Province == null ? null : src.Province.Name)
                .Map(dest => dest.Postal, src => src.Postal)
                .Inherits<Entity.BaseEntity, Pims.Api.Models.BaseModel>();


            config.NewConfig<Model.AddressModel, Entity.Address>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Address1, src => src.Line1)
                .Map(dest => dest.Address2, src => src.Line2)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.ProvinceId, src => src.ProvinceId)
                .Map(dest => dest.Province, src => String.IsNullOrWhiteSpace(src.Province) ? null : new Entity.Province(src.ProvinceId, src.Province))
                .Map(dest => dest.Postal, src => src.Postal)
                .Inherits<Pims.Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
