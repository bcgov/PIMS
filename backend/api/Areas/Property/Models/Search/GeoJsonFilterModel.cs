using Pims.Core.Extensions;
using Pims.Dal.Entities.Models;
using Pims.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel;
using NetTopologySuite.Geometries;

namespace Pims.Api.Areas.Property.Models.Search
{
    /// <summary>
    /// GeoJsonFilterModel class, provides a model to contain the parcel and building filters.
    /// </summary>
    public class GeoJsonFilterModel : PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - Defines a rectangle region of the 2D cordinate plane.
        /// </summary>
        [DisplayName("bbox")]
        public Envelope Boundary { get; set; }

        /// <summary>
        /// get/set - The type of GIS webservice [WFS,WMS].
        /// </summary>
        public string Service { get; set; }

        /// <summary>
        /// get/set - The request name.
        /// </summary>
        public string Request { get; set; }

        /// <summary>
        /// get/set - The layers that should be returned.
        /// </summary>
        public string Layers { get; set; }

        /// <summary>
        /// get/set - Parcel classification Id.
        /// </summary>
        public int? ClassificationId { get; set; }

        /// <summary>
        /// get/set - Parcel status Id.
        /// </summary>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The property address.
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The property administrative area (city, municipality, district, etc.).
        /// </summary>
        /// <value></value>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - The SPP/RAEG project number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - Flag indicating properties in projects should be ignored.
        /// </summary>
        public bool? IgnorePropertiesInProjects { get; set; }

        /// <summary>
        /// get/set - Flag indicating to show only properties that belong to a project.
        /// </summary>
        public bool? InSurplusPropertyProgram { get; set; }

        /// <summary>
        /// get/set - Flag indicating to show only properties in enhanced referral process.
        /// </summary>
        public bool? InEnhancedReferralProcess { get; set; }

        /// <summary>
        /// get/set - A way to filter both Parcel.LandArea and the Building.BuildingRentableArea.
        /// </summary>
        public float? MinLotArea { get; set; }

        /// <summary>
        /// get/set - A way to filter both Parcel.LandArea and the Building.BuildingRentableArea.
        /// </summary>
        public float? MaxLotArea { get; set; }

        /// <summary>
        /// get/set - Building minimum market value.
        /// </summary>
        public decimal? MinMarketValue { get; set; }

        /// <summary>
        /// get/set - Bare land only flag
        /// </summary>
        public bool? BareLandOnly { get; set; }

        /// <summary>
        /// get/set - Building maximum market value.
        /// </summary>
        public decimal? MaxMarketValue { get; set; }

        /// <summary>
        /// get/set - Parcel minimum assessed value.
        /// </summary>
        public decimal? MinAssessedValue { get; set; }

        /// <summary>
        /// get/set - Parcel maximum assessed value.
        /// </summary>
        public decimal? MaxAssessedValue { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        public int[] Agencies { get; set; }

        /// <summary>
        /// get/set - Whether to include properties not owned by user's agency when searching.
        /// </summary>
        public bool IncludeAllProperties { get; set; }

        #region Parcel Filters
        /// <summary>
        /// get/set - The parcel PID.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - Parcel minimum land area.
        /// </summary>
        public float? MinLandArea { get; set; }

        /// <summary>
        /// get/set - Parcel maximum land area.
        /// </summary>
        public float? MaxLandArea { get; set; }
        #endregion

        #region Building Filters

        /// <summary>
        /// get/set - Building construction type Id.
        /// </summary>
        public int? ConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - Property name.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Building predominant use Id.
        /// </summary>
        public int? PredominateUseId { get; set; }

        /// <summary>
        /// get/set - Parent Parcel Id.
        /// </summary>
        public int? ParcelId { get; set; }

        /// <summary>
        /// get/set - Parent Property Type Id.
        /// </summary>
        public PropertyTypes? PropertyType { get; set; }

        /// <summary>
        /// get/set - Building floor count Id.
        /// </summary>
        public int? FloorCount { get; set; }

        /// <summary>
        /// get/set - Building tenancy.
        /// </summary>
        public string Tenancy { get; set; }

        /// <summary>
        /// get/set - Building minimum rentable area.
        /// </summary>
        public float? MinRentableArea { get; set; }

        /// <summary>
        /// get/set - Building rentable area.
        /// </summary>
        public float? RentableArea { get; set; }

        /// <summary>
        /// get/set - Building maximum rentable area.
        /// </summary>
        public float? MaxRentableArea { get; set; }
        #endregion

        /// <summary>
        /// get - Determine if the filter should include parcels.
        /// </summary>
        public bool IncludeParcels
        {
            get
            {
                return this.StatusId.HasValue
                    || this.ClassificationId.HasValue
                    || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                    || !String.IsNullOrWhiteSpace(this.PID)
                    || !String.IsNullOrWhiteSpace(this.AdministrativeArea)
                    || this.MinLotArea.HasValue
                    || this.MaxLotArea.HasValue
                    || this.MinLandArea.HasValue
                    || this.MaxLandArea.HasValue;
            }
        }

        /// <summary>
        /// get - Determine if the filter should include buildings.
        /// </summary>
        public bool IncludeBuildings
        {
            get
            {
                return this.StatusId.HasValue
                    || this.ClassificationId.HasValue
                    || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                    || !String.IsNullOrWhiteSpace(this.Name)
                    || !String.IsNullOrWhiteSpace(this.AdministrativeArea)
                    || this.ConstructionTypeId.HasValue
                    || this.PredominateUseId.HasValue
                    || this.FloorCount.HasValue
                    || !String.IsNullOrWhiteSpace(this.Tenancy)
                    || this.MinRentableArea.HasValue
                    || this.MaxRentableArea.HasValue
                    || this.RentableArea.HasValue;
            }
        }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GeoJsonFilterModel class.
        /// </summary>
        public GeoJsonFilterModel() { }

        /// <summary>
        /// Creates a new instance of a GeoJsonFilterModel class.
        /// </summary>
        /// <param name="bbox"></param>
        public GeoJsonFilterModel(Envelope bbox)
        {
            this.Boundary = bbox;
        }

        /// <summary>
        /// Creates a new instance of a GeoJsonFilterModel class, initializes with the specified arguments.
        /// </summary>
        /// <param name="query"></param>
        public GeoJsonFilterModel(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);

            this.Service = filter.GetStringValue(nameof(this.Service));
            this.Request = filter.GetStringValue(nameof(this.Request));
            this.Layers = filter.GetStringValue(nameof(this.Layers));
            this.Boundary = filter.GetEnvelopNullValue("bbox");

            this.IncludeAllProperties = filter.GetBoolValue(nameof(this.IncludeAllProperties));

            this.Address = filter.GetStringValue(nameof(this.Address));
            this.AdministrativeArea = filter.GetStringValue(nameof(this.AdministrativeArea));

            this.BareLandOnly = filter.GetBoolNullValue(nameof(this.BareLandOnly));
            this.StatusId = filter.GetIntNullValue(nameof(this.StatusId));
            this.ClassificationId = filter.GetIntNullValue(nameof(this.ClassificationId));
            this.ParcelId = filter.GetIntNullValue(nameof(this.ParcelId));
            this.PropertyType = Enum.TryParse(filter.GetStringValue(nameof(this.PropertyType), null), out PropertyTypes propType) ? (PropertyTypes?)propType : null;
            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.IgnorePropertiesInProjects = filter.GetBoolNullValue(nameof(this.IgnorePropertiesInProjects));
            this.InSurplusPropertyProgram = filter.GetBoolNullValue(nameof(this.InSurplusPropertyProgram));
            this.InEnhancedReferralProcess = filter.GetBoolNullValue(nameof(this.InEnhancedReferralProcess));

            this.MinMarketValue = filter.GetDecimalNullValue(nameof(this.MinMarketValue));
            this.MaxMarketValue = filter.GetDecimalNullValue(nameof(this.MaxMarketValue));
            this.MinAssessedValue = filter.GetDecimalNullValue(nameof(this.MinAssessedValue));
            this.MaxAssessedValue = filter.GetDecimalNullValue(nameof(this.MaxAssessedValue));

            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
            this.Name = filter.GetStringValue(nameof(this.Name));

            // Parcel filters.
            this.PID = filter.GetStringValue(nameof(this.PID));
            this.MinLandArea = filter.GetFloatNullValue(nameof(this.MinLandArea)) ?? filter.GetFloatNullValue(nameof(this.MinLotArea));
            this.MaxLandArea = filter.GetFloatNullValue(nameof(this.MaxLandArea)) ?? filter.GetFloatNullValue(nameof(this.MaxLotArea));

            // Building filters.
            this.ConstructionTypeId = filter.GetIntNullValue(nameof(this.ConstructionTypeId));
            this.PredominateUseId = filter.GetIntNullValue(nameof(this.PredominateUseId));
            this.FloorCount = filter.GetIntNullValue(nameof(this.FloorCount));
            this.Tenancy = filter.GetStringValue(nameof(this.Tenancy));
            this.MinRentableArea = filter.GetFloatNullValue(nameof(this.MinRentableArea)) ?? filter.GetFloatNullValue(nameof(this.MinLotArea));
            this.MaxRentableArea = filter.GetFloatNullValue(nameof(this.MaxRentableArea)) ?? filter.GetFloatNullValue(nameof(this.MaxLotArea));
            this.RentableArea = filter.GetFloatNullValue(nameof(this.RentableArea)) ?? filter.GetFloatNullValue(nameof(this.RentableArea));

        }
        #endregion

        #region Methods
        /// <summary>
        /// Convert to a ParcelFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator ParcelFilter(GeoJsonFilterModel model)
        {
            var filter = new ParcelFilter
            {
                Page = model.Page,
                Quantity = model.Quantity,

                SWLongitude = model.Boundary.MinX,
                SWLatitude = model.Boundary.MaxX,
                NELongitude = model.Boundary.MaxX,
                NELatitude = model.Boundary.MaxY,

                ProjectNumber = model.ProjectNumber,
                ClassificationId = model.ClassificationId,
                Address = model.Address,
                AdministrativeArea = model.AdministrativeArea,

                PID = model.PID,
                MinLandArea = model.MinLandArea ?? model.MinLotArea,
                MaxLandArea = model.MaxLandArea ?? model.MaxLotArea,

                MinMarketValue = model.MinMarketValue,
                MaxMarketValue = model.MaxMarketValue,
                MinAssessedValue = model.MinAssessedValue,
                MaxAssessedValue = model.MaxAssessedValue,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return filter;
        }

        /// <summary>
        /// Convert to a BuildingFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator BuildingFilter(GeoJsonFilterModel model)
        {
            var filter = new BuildingFilter
            {
                Page = model.Page,
                Quantity = model.Quantity,

                SWLongitude = model.Boundary.MinX,
                SWLatitude = model.Boundary.MaxX,
                NELongitude = model.Boundary.MaxX,
                NELatitude = model.Boundary.MaxY,

                ProjectNumber = model.ProjectNumber,
                ClassificationId = model.ClassificationId,
                Address = model.Address,
                AdministrativeArea = model.AdministrativeArea,

                MinLandArea = model.MinLandArea ?? model.MinLotArea,
                MaxLandArea = model.MaxLandArea ?? model.MaxLotArea,

                ConstructionTypeId = model.ConstructionTypeId,
                PredominateUseId = model.PredominateUseId,
                FloorCount = model.FloorCount,
                Tenancy = model.Tenancy,
                MinRentableArea = model.MinRentableArea ?? model.MinLotArea,
                MaxRentableArea = model.MaxRentableArea ?? model.MaxLotArea,
                RentableArea = model.RentableArea ?? model.RentableArea,

                MinMarketValue = model.MinMarketValue,
                MaxMarketValue = model.MaxMarketValue,
                MinAssessedValue = model.MinAssessedValue,
                MaxAssessedValue = model.MaxAssessedValue,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return filter;
        }

        /// <summary>
        /// Convert to a ParcelFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator AllPropertyFilter(GeoJsonFilterModel model)
        {
            var filter = new AllPropertyFilter
            {
                Page = model.Page,
                Quantity = model.Quantity,

                SWLongitude = model.Boundary.MinX,
                SWLatitude = model.Boundary.MaxX,
                NELongitude = model.Boundary.MaxX,
                NELatitude = model.Boundary.MaxY,

                BareLandOnly = model.BareLandOnly,
                Name = model.Name,
                ProjectNumber = model.ProjectNumber,
                IgnorePropertiesInProjects = model.IgnorePropertiesInProjects,
                InSurplusPropertyProgram = model.InSurplusPropertyProgram,
                InEnhancedReferralProcess = model.InEnhancedReferralProcess,
                ParcelId = model.ParcelId,
                PropertyType = model.PropertyType,
                ClassificationId = model.ClassificationId,
                Address = model.Address,
                AdministrativeArea = model.AdministrativeArea,

                PID = model.PID,
                MinLandArea = model.MinLandArea ?? model.MinLotArea,
                MaxLandArea = model.MaxLandArea ?? model.MaxLotArea,

                ConstructionTypeId = model.ConstructionTypeId,
                PredominateUseId = model.PredominateUseId,
                FloorCount = model.FloorCount,
                Tenancy = model.Tenancy,
                MinRentableArea = model.MinRentableArea ?? model.MinLotArea,
                MaxRentableArea = model.MaxRentableArea ?? model.MaxLotArea,
                RentableArea = model.RentableArea ?? model.RentableArea,
                MinMarketValue = model.MinMarketValue,
                MaxMarketValue = model.MaxMarketValue,
                MinAssessedValue = model.MinAssessedValue,
                MaxAssessedValue = model.MaxAssessedValue,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return filter;
        }

        /// <summary>
        /// Determine if a valid filter was provided.
        /// </summary>
        /// <returns></returns>
        public override bool IsValid()
        {
            return base.IsValid()
                || this.Boundary.MinX != 0
                || this.Boundary.MinY != 0
                || this.Boundary.MaxX != -1
                || this.Boundary.MaxY != -1
                || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                || !String.IsNullOrWhiteSpace(this.Address)
                || !String.IsNullOrWhiteSpace(this.AdministrativeArea)
                || this.MaxAssessedValue.HasValue
                || this.MinAssessedValue.HasValue
                || this.MinMarketValue.HasValue
                || this.MaxMarketValue.HasValue
                || this.Agencies?.Any() == true
                || this.PropertyType.HasValue
                || this.StatusId.HasValue
                || this.ClassificationId.HasValue
                || this.MinLandArea.HasValue
                || this.MaxLandArea.HasValue
                || this.ConstructionTypeId.HasValue
                || this.PredominateUseId.HasValue
                || this.FloorCount.HasValue
                || this.MinRentableArea.HasValue
                || this.RentableArea.HasValue
                || this.BareLandOnly == true
                || this.MaxRentableArea.HasValue
                || !String.IsNullOrWhiteSpace(this.PID)
                || !String.IsNullOrWhiteSpace(this.Tenancy)
                || !String.IsNullOrWhiteSpace(this.Name);
        }
        #endregion
    }
}
