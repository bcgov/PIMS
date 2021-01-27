using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Mapping.Converters;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using BModel = Pims.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Property.Mapping.Parcel
{
    public class BuildingParcelMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingParcelMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public BuildingParcelMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ParcelBuilding, Model.BuildingParcelModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Parcel.Id)
                .Map(dest => dest.PID, src => src.Parcel.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.Parcel.PIN)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.Parcel.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.Name, src => src.Parcel.Name)
                .Map(dest => dest.Description, src => src.Parcel.Description)
                .Map(dest => dest.ClassificationId, src => src.Parcel.ClassificationId)
                .Map(dest => dest.Classification, src => src.Parcel.Classification.Name)
                .Map(dest => dest.AgencyId, src => src.Parcel.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Parcel.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Parcel.Agency))
                .Map(dest => dest.Latitude, src => src.Parcel.Location.Y)
                .Map(dest => dest.Longitude, src => src.Parcel.Location.X)
                .Map(dest => dest.Address, src => src.Parcel.Address)
                .Map(dest => dest.LandArea, src => src.Parcel.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.Parcel.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Parcel.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.Parcel.ZoningPotential)
                .Map(dest => dest.IsSensitive, src => src.Parcel.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.Parcel.IsVisibleToOtherAgencies)
                .Map(dest => dest.Buildings, src => src.Parcel.Buildings)
                .Map(dest => dest.Evaluations, src => src.Parcel.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Parcel.Fiscals)
                .Map(dest => dest.RowVersion, src => src.Parcel.RowVersion == null ? null : Convert.ToBase64String(src.Parcel.RowVersion))
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();
                
                

            config.NewConfig<Model.BuildingParcelModel, Entity.Parcel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => ParcelConverter.ConvertPID(src.PID))
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Serialize<IEnumerable<string>>(src.ProjectNumbers ?? Enumerable.Empty<string>(), _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Location, src => src)
                .Map(dest => dest.AddressId, src => src.Address == null ? 0 : src.Address.Id)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.ZoningPotential)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.IsVisibleToOtherAgencies)
                .Map(dest => dest.Buildings, src => src.Buildings)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.BuildingParcelModel, Entity.ParcelBuilding>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.ParcelId, src => src.Id)
                .Map(dest => dest.Parcel, src => src)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.ParcelModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
