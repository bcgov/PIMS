using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ParcelFilter class, provides a model for filtering parcel queries.
    /// </summary>
    public class ParcelFilter
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
        /// get/set - Building classification Id.
        /// </summary>
        /// <value></value>
        public int? ClassificationId { get; set; }

        /// <summary>
        /// get/set - Building status Id.
        /// </summary>
        /// <value></value>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The property address.
        /// </summary>
        /// <value></value>
        public string Address { get; set; }

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
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelFilter class.
        /// </summary>
        public ParcelFilter() { }

        /// <summary>
        /// Creates a new instance of a ParcelFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        public ParcelFilter(double neLat, double neLong, double swLat, double swLong)
        {
            this.NELatitude = neLat;
            this.NELongitude = neLong;
            this.SWLatitude = swLat;
            this.SWLongitude = swLong;
        }

        /// <summary>
        /// Creates a new instance of a ParcelFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="agencyId"></param>
        /// <param name="statusId"></param>
        /// <param name="classificationId"></param>
        /// <param name="minLandArea"></param>
        /// <param name="maxLandArea"></param>
        /// <param name="minEstimatedValue"></param>
        /// <param name="maxEstimatedValue"></param>
        /// <param name="minAssessedValue"></param>
        /// <param name="maxAssessedValue"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public ParcelFilter(string address, int? agencyId, int? statusId, int? classificationId, float? minLandArea, float? maxLandArea, float? minEstimatedValue, float? maxEstimatedValue, float? minAssessedValue, float? maxAssessedValue, string[] sort)
        {
            this.Address = address;
            this.StatusId = statusId;
            this.ClassificationId = classificationId;
            this.MinLandArea = minLandArea;
            this.MaxLandArea = maxLandArea;
            this.MinEstimatedValue = minEstimatedValue;
            this.MaxEstimatedValue = maxEstimatedValue;
            this.MinAssessedValue = minAssessedValue;
            this.MaxAssessedValue = maxAssessedValue;
            if (agencyId.HasValue)
                this.Agencies = new[] { agencyId.Value };
            this.Sort = sort;
        }

        /// <summary>
        /// Creates a new instance of a ParcelFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public ParcelFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
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
            this.MinLandArea = filter.GetFloatNullValue(nameof(this.MinLandArea));
            this.MaxLandArea = filter.GetFloatNullValue(nameof(this.MaxLandArea));
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
                || this.StatusId.HasValue
                || this.ClassificationId.HasValue
                || this.MinLandArea.HasValue
                || this.MaxLandArea.HasValue;
        }
        #endregion
    }
}
