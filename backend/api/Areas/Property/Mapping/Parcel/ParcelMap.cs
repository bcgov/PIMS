using Mapster;
using Pims.Api.Mapping.Converters;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using BModel = Pims.Api.Models;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Pims.Dal.Helpers.Extensions;
using System.Linq;

namespace Pims.Api.Areas.Property.Mapping.Parcel
{
    public class ParcelMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public ParcelMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Parcel, Model.ParcelModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.ProjectWorkflow, src => src.GetLatestWorkflowCode())
                .Map(dest => dest.ProjectStatus, src => src.GetLatestProjectStatus())
                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification.Name)
                .Map(dest => dest.EncumbranceReason, src => src.EncumbranceReason)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
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
                .Map(dest => dest.Parcels, src => src.Parcels)
                .Map(dest => dest.Subdivisions, src => src.Subdivisions)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelModel, Entity.Parcel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => ParcelConverter.ConvertPID(src.PID))
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Serialize<IEnumerable<string>>(src.ProjectNumbers ?? Enumerable.Empty<string>(), _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.EncumbranceReason, src => src.EncumbranceReason)
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
                .Map(dest => dest.Parcels, src => src.Parcels)
                .Map(dest => dest.Subdivisions, src => src.Subdivisions)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.ParcelModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
