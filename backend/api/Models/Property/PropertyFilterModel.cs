using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;
using Pims.Dal.Entities.Models;

namespace Pims.Api.Models.Property
{
    /// <summary>
    /// PropertyFilterModel class, provides a model to contain the parcel and building filters.
    /// </summary>
    public class PropertyFilterModel
    {
        #region Properties
        /// <summary>
        /// get/set - North East Latitude.
        /// </summary>
        /// <value></value>
        public double? NELatitude { get; set; }

        /// <summary>
        /// get/set - North East Longitude.
        /// </summary>
        /// <value></value>
        public double? NELongitude { get; set; }

        /// <summary>
        /// get/set - South West Latitude.
        /// </summary>
        /// <value></value>
        public double? SWLatitude { get; set; }

        /// <summary>
        /// get/set - South West Longitude.
        /// </summary>
        /// <value></value>
        public double? SWLongitude { get; set; }

        /// <summary>
        /// get/set - Parcel classification Id.
        /// </summary>
        /// <value></value>
        public int? ClassificationId { get; set; }

        /// <summary>
        /// get/set - Parcel status Id.
        /// </summary>
        /// <value></value>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The property address.
        /// </summary>
        /// <value></value>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The SPP/RAEG project number.
        /// </summary>
        /// <value></value>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - A way to filter both Parcel.LandArea and the Building.BuildingRentableArea.
        /// </summary>
        /// <value></value>
        public float? MinLotArea { get; set; }

        /// <summary>
        /// get/set - A way to filter both Parcel.LandArea and the Building.BuildingRentableArea.
        /// </summary>
        /// <value></value>
        public float? MaxLotArea { get; set; }

        /// <summary>
        /// get/set - Building minimum estimated value.
        /// </summary>
        /// <value></value>
        public float? MinEstimatedValue { get; set; }

        /// <summary>
        /// get/set - Building maximum estimated value.
        /// </summary>
        /// <value></value>
        public float? MaxEstimatedValue { get; set; }

        /// <summary>
        /// get/set - Parcel minimum assessed value.
        /// </summary>
        /// <value></value>
        public float? MinAssessedValue { get; set; }

        /// <summary>
        /// get/set - Parcel maximum assessed value.
        /// </summary>
        /// <value></value>
        public float? MaxAssessedValue { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }

        /// <summary>
        /// get/set - An array of sorting parcel conditions (i.e. AgencyId desc, ClassificationId asc)
        /// </summary>
        /// <value></value>
        public string[] Sort { get; set; }

        #region Parcel Filters
        /// <summary>
        /// get/set - The property municipality.
        /// </summary>
        /// <value></value>
        public string Municipality { get; set; }

        /// <summary>
        /// get/set - Parcel minimum land area.
        /// </summary>
        /// <value></value>
        public float? MinLandArea { get; set; }

        /// <summary>
        /// get/set - Parcel maximum land area.
        /// </summary>
        /// <value></value>
        public float? MaxLandArea { get; set; }
        #endregion

        #region Building Filters

        /// <summary>
        /// get/set - Building construction type Id.
        /// </summary>
        /// <value></value>
        public int? ConstructionTypeId { get; set; }

        /// <summary>
        /// get/set - Building predominant use Id.
        /// </summary>
        /// <value></value>
        public int? PredominateUseId { get; set; }

        /// <summary>
        /// get/set - Building floor count Id.
        /// </summary>
        /// <value></value>
        public int? FloorCount { get; set; }

        /// <summary>
        /// get/set - Building tenancy.
        /// </summary>
        /// <value></value>
        public string Tenancy { get; set; }

        /// <summary>
        /// get/set - Building minimum rentable area.
        /// </summary>
        /// <value></value>
        public float? MinRentableArea { get; set; }

        /// <summary>
        /// get/set - Building maximum rentable area.
        /// </summary>
        /// <value></value>
        public float? MaxRentableArea { get; set; }
        #endregion

        /// <summary>
        /// get - Determine if the filter should include parcels.
        /// </summary>
        /// <value></value>
        public bool IncludeParcels
        {
            get
            {
                return this.StatusId.HasValue
                    || this.ClassificationId.HasValue
                    || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                    || !String.IsNullOrWhiteSpace(this.Municipality)
                    || this.MinLotArea.HasValue
                    || this.MaxLotArea.HasValue
                    || this.MinLandArea.HasValue
                    || this.MaxLandArea.HasValue;
            }
        }

        /// <summary>
        /// get - Determine if the filter should include buildings.
        /// </summary>
        /// <value></value>
        public bool IncludeBuildings
        {
            get
            {
                return this.StatusId.HasValue
                    || this.ClassificationId.HasValue
                    || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                    || this.ConstructionTypeId.HasValue
                    || this.PredominateUseId.HasValue
                    || this.FloorCount.HasValue
                    || !String.IsNullOrWhiteSpace(this.Tenancy)
                    || this.MinRentableArea.HasValue
                    || this.MaxRentableArea.HasValue;
            }
        }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyFilterModel class.
        /// </summary>
        public PropertyFilterModel() { }

        /// <summary>
        /// Creates a new instance of a PropertyFilterModel class.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        public PropertyFilterModel(double neLat, double neLong, double swLat, double swLong)
        {
            this.NELatitude = neLat;
            this.NELongitude = neLong;
            this.SWLatitude = swLat;
            this.SWLongitude = swLong;
        }

        /// <summary>
        /// Creates a new instance of a PropertyFilterModel class, initializes with the specified arguments.
        /// </summary>
        /// <param name="query"></param>
        public PropertyFilterModel(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);

            this.NELatitude = filter.GetDoubleNullValue(nameof(this.NELatitude));
            this.NELongitude = filter.GetDoubleNullValue(nameof(this.NELongitude));
            this.SWLatitude = filter.GetDoubleNullValue(nameof(this.SWLatitude));
            this.SWLongitude = filter.GetDoubleNullValue(nameof(this.SWLongitude));
            this.Address = filter.GetStringValue(nameof(this.Address));

            this.StatusId = filter.GetIntNullValue(nameof(this.StatusId));
            this.ClassificationId = filter.GetIntNullValue(nameof(this.ClassificationId));
            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));

            this.MinEstimatedValue = filter.GetFloatNullValue(nameof(this.MinEstimatedValue));
            this.MaxEstimatedValue = filter.GetFloatNullValue(nameof(this.MaxEstimatedValue));
            this.MinAssessedValue = filter.GetFloatNullValue(nameof(this.MinAssessedValue));
            this.MaxAssessedValue = filter.GetFloatNullValue(nameof(this.MaxAssessedValue));

            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));

            // Parcel filters.
            this.Municipality = filter.GetStringValue(nameof(this.Municipality));
            this.MinLandArea = filter.GetFloatNullValue(nameof(this.MinLandArea)) ?? filter.GetFloatNullValue(nameof(this.MinLotArea));
            this.MaxLandArea = filter.GetFloatNullValue(nameof(this.MaxLandArea)) ?? filter.GetFloatNullValue(nameof(this.MaxLotArea));

            // Building filters.
            this.ConstructionTypeId = filter.GetIntNullValue(nameof(this.ConstructionTypeId));
            this.PredominateUseId = filter.GetIntNullValue(nameof(this.PredominateUseId));
            this.FloorCount = filter.GetIntNullValue(nameof(this.FloorCount));
            this.Tenancy = filter.GetStringValue(nameof(this.Tenancy));
            this.MinRentableArea = filter.GetFloatNullValue(nameof(this.MinRentableArea)) ?? filter.GetFloatNullValue(nameof(this.MinLotArea));
            this.MaxRentableArea = filter.GetFloatNullValue(nameof(this.MaxRentableArea)) ?? filter.GetFloatNullValue(nameof(this.MaxLotArea));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Convert to a ParcelFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator ParcelFilter(PropertyFilterModel model)
        {
            var parcel = new ParcelFilter
            {
                NELatitude = model.NELatitude,
                NELongitude = model.NELongitude,
                SWLatitude = model.SWLatitude,
                SWLongitude = model.SWLongitude,

                ProjectNumber = model.ProjectNumber,
                StatusId = model.StatusId,
                ClassificationId = model.ClassificationId,
                Address = model.Address,
                Municipality = model.Municipality,
                MinLandArea = model.MinLandArea ?? model.MinLotArea,
                MaxLandArea = model.MaxLandArea ?? model.MaxLotArea,
                MinEstimatedValue = model.MinEstimatedValue,
                MaxEstimatedValue = model.MaxEstimatedValue,
                MinAssessedValue = model.MinAssessedValue,
                MaxAssessedValue = model.MaxAssessedValue,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return parcel;
        }

        /// <summary>
        /// Convert to a BuildingFilter.
        /// </summary>
        /// <param name="model"></param>
        public static explicit operator BuildingFilter(PropertyFilterModel model)
        {
            var parcel = new BuildingFilter
            {
                NELatitude = model.NELatitude,
                NELongitude = model.NELongitude,
                SWLatitude = model.SWLatitude,
                SWLongitude = model.SWLongitude,

                ProjectNumber = model.ProjectNumber,
                StatusId = model.StatusId,
                ClassificationId = model.ClassificationId,
                Address = model.Address,
                ConstructionTypeId = model.ConstructionTypeId,
                PredominateUseId = model.PredominateUseId,
                FloorCount = model.FloorCount,
                Tenancy = model.Tenancy,
                MinRentableArea = model.MinRentableArea ?? model.MinLotArea,
                MaxRentableArea = model.MaxRentableArea ?? model.MaxLotArea,
                MinEstimatedValue = model.MinEstimatedValue,
                MaxEstimatedValue = model.MaxEstimatedValue,
                MinAssessedValue = model.MinAssessedValue,
                MaxAssessedValue = model.MaxAssessedValue,

                Agencies = model.Agencies,
                Sort = model.Sort
            };

            return parcel;
        }

        /// <summary>
        /// Determine if a valid filter was provided.
        /// </summary>
        /// <returns></returns>
        public bool ValidFilter()
        {
            return this.NELatitude.HasValue
                || this.NELongitude.HasValue
                || this.SWLatitude.HasValue
                || this.SWLongitude.HasValue
                || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                || !String.IsNullOrWhiteSpace(this.Address)
                || this.MaxAssessedValue.HasValue
                || this.MinAssessedValue.HasValue
                || this.MinEstimatedValue.HasValue
                || this.MaxEstimatedValue.HasValue
                || this.Agencies?.Any() == true
                || this.StatusId.HasValue
                || this.ClassificationId.HasValue
                || this.MinLandArea.HasValue
                || this.MaxLandArea.HasValue
                || this.ConstructionTypeId.HasValue
                || this.PredominateUseId.HasValue
                || this.FloorCount.HasValue
                || this.MinRentableArea.HasValue
                || this.MaxRentableArea.HasValue
                || !String.IsNullOrWhiteSpace(this.Municipality)
                || !String.IsNullOrWhiteSpace(this.Tenancy);
        }
        #endregion
    }
}
