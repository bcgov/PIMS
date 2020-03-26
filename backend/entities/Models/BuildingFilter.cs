using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// BuildingFilter class, provides a model for filtering building queries.
    /// </summary>
    public class BuildingFilter
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
        /// get/set - The property address.
        /// </summary>
        /// <value></value>
        public string Address { get; set; }

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
        /// get/set - Building minimum assessed value.
        /// </summary>
        /// <value></value>
        public float? MinAssessedValue { get; set; }

        /// <summary>
        /// get/set - Building maximum assessed value.
        /// </summary>
        /// <value></value>
        public float? MaxAssessedValue { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }

        /// <summary>
        /// get/set - An array of sorting building conditions (i.e. AgencyId desc, ClassificationId asc)
        /// </summary>
        /// <value></value>
        public string[] Sort { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingFilter class.
        /// </summary>
        public BuildingFilter() { }

        /// <summary>
        /// Creates a new instance of a BuildingFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        public BuildingFilter(double neLat, double neLong, double swLat, double swLong)
        {
            this.NELatitude = neLat;
            this.NELongitude = neLong;
            this.SWLatitude = swLat;
            this.SWLongitude = swLong;
        }

        /// <summary>
        /// Creates a new instance of a BuildingFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="agencyId"></param>
        /// <param name="constructionTypeId"></param>
        /// <param name="predominantUseId"></param>
        /// <param name="floorCount"></param>
        /// <param name="tenancy"></param>
        /// <param name="minRentableArea"></param>
        /// <param name="maxRentableArea"></param>
        /// <param name="minEstimatedValue"></param>
        /// <param name="maxEstimatedValue"></param>
        /// <param name="minAssessedValue"></param>
        /// <param name="maxAssessedValue"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public BuildingFilter(string address, int? agencyId, int? constructionTypeId, int? predominantUseId, int? floorCount, string tenancy, float? minRentableArea, float? maxRentableArea, float? minEstimatedValue, float? maxEstimatedValue, float? minAssessedValue, float? maxAssessedValue, string[] sort)
        {
            this.Address = address;
            this.ConstructionTypeId = constructionTypeId;
            this.PredominateUseId = predominantUseId;
            this.FloorCount = floorCount;
            this.Tenancy = tenancy;
            this.MinRentableArea = minRentableArea;
            this.MaxRentableArea = maxRentableArea;
            this.MinEstimatedValue = minEstimatedValue;
            this.MaxEstimatedValue = maxEstimatedValue;
            this.MinAssessedValue = minAssessedValue;
            this.MaxAssessedValue = maxAssessedValue;
            if (agencyId.HasValue)
                this.Agencies = new[] { agencyId.Value };
            this.Sort = sort;
        }

        /// <summary>
        /// Creates a new instance of a BuildingFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public BuildingFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.NELatitude = filter.GetDoubleNullValue(nameof(this.NELatitude));
            this.NELongitude = filter.GetDoubleNullValue(nameof(this.NELongitude));
            this.SWLatitude = filter.GetDoubleNullValue(nameof(this.SWLatitude));
            this.SWLongitude = filter.GetDoubleNullValue(nameof(this.SWLongitude));

            this.Address = filter.GetStringValue(nameof(this.Address));
            this.ConstructionTypeId = filter.GetIntNullValue(nameof(this.ConstructionTypeId));
            this.PredominateUseId = filter.GetIntNullValue(nameof(this.PredominateUseId));
            this.FloorCount = filter.GetIntNullValue(nameof(this.FloorCount));
            this.Tenancy = filter.GetStringValue(nameof(this.Tenancy));
            this.MinRentableArea = filter.GetFloatNullValue(nameof(this.MinRentableArea));
            this.MaxRentableArea = filter.GetFloatNullValue(nameof(this.MaxRentableArea));
            this.MinEstimatedValue = filter.GetFloatNullValue(nameof(this.MinEstimatedValue));
            this.MaxEstimatedValue = filter.GetFloatNullValue(nameof(this.MaxEstimatedValue));
            this.MinAssessedValue = filter.GetFloatNullValue(nameof(this.MinAssessedValue));
            this.MaxAssessedValue = filter.GetFloatNullValue(nameof(this.MaxAssessedValue));

            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
        }
        #endregion

        #region Methods


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
                || !String.IsNullOrWhiteSpace(this.Address)
                || this.MaxAssessedValue.HasValue
                || this.MinAssessedValue.HasValue
                || this.MinEstimatedValue.HasValue
                || this.MaxEstimatedValue.HasValue
                || this.Agencies?.Any() == true
                || this.ConstructionTypeId.HasValue
                || this.PredominateUseId.HasValue
                || this.FloorCount.HasValue
                || this.MinRentableArea.HasValue
                || this.MaxRentableArea.HasValue
                || !String.IsNullOrWhiteSpace(this.Tenancy);
        }
        #endregion
    }
}
