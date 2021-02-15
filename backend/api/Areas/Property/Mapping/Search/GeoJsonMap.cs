using Mapster;
using Microsoft.Extensions.Options;
using NetTopologySuite.Geometries;
using System.Collections.Generic;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Search;

namespace Pims.Api.Areas.Property.Mapping.Search
{
    public class GeoJsonMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public GeoJsonMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Models.PropertyModel, Model.GeoJson<Model.PropertyModel>>()
                .Map(dest => dest.Type, src => "Feature")
                .Map(dest => dest.Geometry.Type, src => src.Location != null ? src.Location.GeometryType : "Point")
                .Map(dest => dest.Geometry.Coordinates, src => src.Location)
                .Map(dest => dest.Properties, src => src);

            config.NewConfig<Entity.Models.PropertyModel, Model.PropertyModel>()
                .Include<Entity.Models.ParcelModel, Model.PropertyModel>()
                .Include<Entity.Models.BuildingModel, Model.PropertyModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.AddressId, src => src.AddressId)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.ProjectWorkflow, src => src.ProjectWorkflow)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.Classification, src => src.Classification)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Province, src => src.Province)
                .Map(dest => dest.Postal, src => src.Postal)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)

                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency)
                .Map(dest => dest.AgencyCode, src => src.AgencyCode)
                .Map(dest => dest.SubAgency, src => src.SubAgency)
                .Map(dest => dest.SubAgencyCode, src => src.SubAgencyCode)

                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.MarketFiscalYear, src => src.MarketFiscalYear)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.NetBookFiscalYear, src => src.NetBookFiscalYear);

            config.NewConfig<Entity.Models.ParcelModel, Model.PropertyModel>()
                .Inherits<Entity.Models.PropertyModel, Model.PropertyModel>()
                .Map(dest => dest.PID, src => src.PID)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.Zoning, src => src.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.ZoningPotential)

                .Map(dest => dest.AssessedLand, src => src.AssessedLand)
                .Map(dest => dest.AssessedLandDate, src => src.AssessedLandDate)
                .Map(dest => dest.AssessedBuilding, src => src.AssessedBuilding)
                .Map(dest => dest.AssessedBuildingDate, src => src.AssessedBuildingDate);

            config.NewConfig<Entity.Models.BuildingModel, Model.PropertyModel>()
                .Inherits<Entity.Models.PropertyModel, Model.PropertyModel>()
                .Map(dest => dest.ConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.ConstructionType, src => src.BuildingConstructionType)
                .Map(dest => dest.FloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.PredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.PredominateUse, src => src.BuildingPredominateUse)
                .Map(dest => dest.Tenancy, src => src.BuildingTenancy)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.OccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.OccupantType, src => src.BuildingOccupantType)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.TransferLeaseOnSale, src => src.TransferLeaseOnSale)

                .Map(dest => dest.AssessedBuilding, src => src.Assessed)
                .Map(dest => dest.AssessedBuildingDate, src => src.AssessedDate);

            config.NewConfig<Entity.Models.ProjectProperty, Model.GeoJson<Model.PropertyModel>>()
                .Map(dest => dest.Type, src => "Feature")
                .Map(dest => dest.Geometry.Type, src => src.Location.GeometryType)
                .Map(dest => dest.Geometry.Coordinates, src => src.Location)
                .Map(dest => dest.Properties, src => src);

            config.NewConfig<Point, Geometry>()
                .ConstructUsing(src => new Point(src.Coordinate));

            config.NewConfig<Polygon, Geometry>()
                .ConstructUsing(src => new Polygon(new LinearRing(src.Coordinates)));
        }
    }
}
