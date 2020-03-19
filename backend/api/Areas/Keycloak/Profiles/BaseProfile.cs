using System;
using AutoMapper;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Keycloak.Models;

namespace Pims.Api.Areas.Keycloak.Profiles
{
    /// <summary>
    /// BaseProfile class, provides automapper configuration for base models.
    /// </summary>
    public class BaseProfile : Profile
    {
        #region Constructors
        public BaseProfile()
        {
            CreateMap<Entity.BaseEntity, Model.Update.BaseModel>()
                .IncludeAllDerived()
                .ForMember(dest => dest.RowVersion, opt => opt.MapFrom(src => Convert.ToBase64String(src.RowVersion)));

            CreateMap<Model.Update.BaseModel, Entity.BaseEntity>()
                .IncludeAllDerived()
                .ForMember(dest => dest.RowVersion, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedById, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedById, opt => opt.Ignore())
                .AfterMap((source, dest) =>
                {
                    if (!String.IsNullOrWhiteSpace(source.RowVersion))
                    {
                        var rowversion = Convert.FromBase64String(source.RowVersion);
                        if (dest.RowVersion == null)
                        {
                            dest.RowVersion = new byte[rowversion.Length];
                        }
                        Buffer.BlockCopy(rowversion, 0, dest.RowVersion, 0, rowversion.Length);
                    }
                });
        }
        #endregion
    }
}
