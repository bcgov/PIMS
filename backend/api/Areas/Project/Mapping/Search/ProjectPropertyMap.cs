using Mapster;
using Pims.Dal.Entities;
using System.Linq;
using System.Collections.Generic;
using Pims.Api.Areas.Project.Models.Search;
using Pims.Api.Models;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Api.Areas.Project.Mapping.Search
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
                .Map(dest => dest.Name, src => src.Building != null ? src.Building.Description : src.Parcel.Description)
                .Map(dest => dest.Address,
                    src => src.Building != null
                        ? src.Building.Address.FormatAddress()
                        : src.Parcel.Address.FormatAddress())
                .Map(dest => dest.City,
                    src => src.Building != null ? src.Building.Address.City.Name : src.Parcel.Address.City.Name)
                .Map(dest => dest.Municipality, src => src.Building != null ? src.Building.Parcel.Municipality : src.Parcel.Municipality)
                .Map(dest => dest.Assessed,
                    src => src.Building != null
                        ? GetBuildingAssessedValue(src.Building.Evaluations)
                        : GetParcelAssessedValue(src.Parcel.Evaluations))
                .Map(dest => dest.NetBook,
                    src => src.Building != null
                        ? GetBuildingNetValue(src.Building.Fiscals)
                        : GetParcelNetValue(src.Parcel.Fiscals))
                .Map(dest => dest.Estimated,
                    src => src.Building != null
                        ? GetBuildingEstimatedValue(src.Building.Fiscals)
                        : GetParcelEstimatedValue(src.Parcel.Fiscals))

                .Map(dest => dest.AgencyCode,
                    src => src.Building != null ? GetAgencyCode(src.Building.Agency) : GetAgencyCode(src.Parcel.Agency))
                .Map(dest => dest.SubAgency,
                    src => src.Building != null ? GetAgencyName(src.Building.Agency) : GetAgencyName(src.Parcel.Agency))

                .Map(dest => dest.LandArea, src => src.Building != null ? GetLandArea(src.Building.Parcel) : GetLandArea(src.Parcel))
                .Map(dest => dest.ParcelId, src => src.Building != null ? src.Building.Parcel.GetId() : src.Parcel.GetId())
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

        private decimal GetBuildingAssessedValue(ICollection<BuildingEvaluation> evaluations)
        {
            var evaluation = evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed);
            return evaluation?.Value ?? 0;
        }

        private decimal GetParcelAssessedValue(ICollection<ParcelEvaluation> evaluations)
        {
            var parcelEvaluation = evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed);
            return parcelEvaluation?.Value ?? 0;
        }

        private decimal GetBuildingNetValue(ICollection<BuildingFiscal> fiscals)
        {
            var buildingFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook);
            return buildingFiscal?.Value ?? 0;
        }

        private decimal GetBuildingEstimatedValue(ICollection<BuildingFiscal> fiscals)
        {
            var buildingFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated);
            return buildingFiscal?.Value ?? 0;
        }

        private decimal GetParcelNetValue(ICollection<ParcelFiscal> fiscals)
        {
            var parcelFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook);
            return parcelFiscal?.Value ?? 0;
        }

        private decimal GetParcelEstimatedValue(ICollection<ParcelFiscal> fiscals)
        {
            var parcelFiscal = fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated);
            return parcelFiscal?.Value ?? 0;
        }

    }
}
