using Mapster;
using Pims.Api.Areas.Reports.Models.Project;
using Pims.Api.Models;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Helpers.Extensions;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Reports.Mapping.Project
{
    public class ProjectPropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {

            config.NewConfig<ProjectProperty, ProjectPropertyModel>()
                .Map(dest => dest.PropertyTypeId,
                    src => src.Building != null ? PropertyTypes.Building : PropertyTypes.Land)
                .Map(dest => dest.Id, src => src.BuildingId ?? src.ParcelId)
                .Map(dest => dest.Classification,
                    src => src.Building != null ? src.Building.Classification.Name : src.Parcel.Classification.Name)
                .Map(dest => dest.Name, src => src.Building != null ? src.Building.Name : src.Parcel.Name)
                .Map(dest => dest.Address,
                    src => src.Building != null
                        ? src.Building.Address.FormatAddress()
                        : src.Parcel.Address.FormatAddress())
                .Map(dest => dest.AdministrativeArea,
                    src => src.Building != null ? src.Building.Address.AdministrativeArea : src.Parcel.Address.AdministrativeArea)
                .Map(dest => dest.Assessed,
                    src => src.Building != null
                        ? src.Building.GetCurrentEvaluation(EvaluationKeys.Assessed)
                        : src.Parcel.GetCurrentEvaluation(EvaluationKeys.Assessed))
                .Map(dest => dest.NetBook,
                    src => src.Building != null
                        ? src.Building.GetCurrentFiscal(FiscalKeys.NetBook)
                        : src.Parcel.GetCurrentFiscal(FiscalKeys.NetBook))
                .Map(dest => dest.Market,
                    src => src.Building != null
                        ? src.Building.GetCurrentFiscal(FiscalKeys.Market)
                        : src.Parcel.GetCurrentFiscal(FiscalKeys.Market))
                .Map(dest => dest.Zoning, src => src.Building != null ? src.Building.GetZoning().First() : src.Parcel.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.Building != null ? src.Building.GetZoningPotential().First() : src.Parcel.ZoningPotential)

                .Map(dest => dest.AgencyCode,
                    src => src.Building != null ? GetAgencyCode(src.Building.Agency) : GetAgencyCode(src.Parcel.Agency))
                .Map(dest => dest.SubAgency,
                    src => src.Building != null ? GetAgencyName(src.Building.Agency) : GetAgencyName(src.Parcel.Agency))

                .Map(dest => dest.LandArea, src => src.Building != null ? GetLandArea(src.Building.Parcels.FirstOrDefault().Parcel) : GetLandArea(src.Parcel))
                .Map(dest => dest.ParcelId, src => src.Building != null ? src.Building.Parcels.FirstOrDefault().ParcelId : src.Parcel.GetId())
                .Inherits<BaseEntity, BaseModel>();

        }

        private float? GetLandArea(Parcel parcel)
        {
            return parcel?.LandArea;
        }

        private string GetAgencyCode(Agency agency)
        {
            return agency.Parent?.Code ?? agency.Code;
        }

        private string GetAgencyName(Agency agency)
        {
            return agency != null ? agency.Name : "";
        }

    }
}
