using Mapster;
using Pims.Api.Mapping.Converters;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using BModel = Pims.Api.Models;
using Pims.Dal.Helpers.Extensions;
using System.Text.Json;
using Microsoft.Extensions.Options;
using System.Linq;

namespace Pims.Api.Areas.Property.Mapping.Parcel
{
    public class ParcelParcelMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelParcelMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public ParcelParcelMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            //all mappings for mapping between a subdivision parcel that has divided parcels. Users cannot edit parcels/subdivisions through entity relationships so just pass ids.
            config.NewConfig<Entity.Parcel, Model.SubdivisionParcelModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => src.PID)
                .Map(dest => dest.PIN, src => src.PIN)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Entity.ParcelParcel, Model.SubdivisionParcelModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Parcel.Id)
                .Map(dest => dest.PID, src => src.Parcel.PID)
                .Map(dest => dest.PIN, src => src.Parcel.PIN)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.SubdivisionParcelModel, Entity.ParcelParcel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.ParcelId, src => src.Id)
                .Map(dest => dest.Parcel.PID, src => ParcelConverter.ConvertPID(src.PID))
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();



            //all mappings for mapping between a divided parcel that has subdivisions. Users cannot edit parcels/subdivisions through entity relationships so just pass ids.
            config.NewConfig<Entity.Parcel, Model.ParcelSubdivisionModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PID, src => src.PID)
                .Map(dest => dest.PIN, src => src.PIN)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelSubdivisionModel, Entity.Parcel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Entity.ParcelParcel, Model.ParcelSubdivisionModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Subdivision.Id)
                .Map(dest => dest.PID, src => src.Subdivision.PID)
                .Map(dest => dest.PIN, src => src.Subdivision.PIN)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelSubdivisionModel, Entity.ParcelParcel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.SubdivisionId, src => src.Id)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();
        }
    }
}
