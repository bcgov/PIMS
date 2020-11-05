using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// PropertyFilter class, provides a model for filtering property queries.
    /// </summary>
    public abstract class PropertyFilter : PageFilter
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
        /// get/set - The RAEG/SPP number.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - Flag indicating properties in projects should be ignored.
        /// </summary>
        /// <value></value>
        public bool? IgnorePropertiesInProjects { get; set; }

        /// <summary>
        /// get/set - Flag indicating to show only properties that belong to a project.
        /// </summary>
        /// <value></value>
        public bool? InSurplusPropertyProgram { get; set; }

        /// <summary>
        /// get/set - Flag indicating to show only properties that are in en enhanced referral program.
        /// </summary>
        /// <value></value>
        public bool? InEnhancedReferralProcess { get; set; }

        /// <summary>
        /// get/set - The parcelId for the property
        /// </summary>
        /// <value></value>
        public int? ParcelId { get; set;}

        /// <summary>
        /// get/set - Building classification Id.
        /// </summary>
        /// <value></value>
        public int? ClassificationId { get; set; }

        /// <summary>
        /// get/set - The property description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The property address.
        /// </summary>
        /// <value></value>
        public string Address { get; set; }

        /// <summary>
        /// get/set - The property administrative area (city, muncipality, district, etc.).
        /// </summary>
        public string AdministrativeArea { get; set; }

        /// <summary>
        /// get/set - Building minimum estimated value.
        /// </summary>
        /// <value></value>
        public decimal? MinEstimatedValue { get; set; }

        /// <summary>
        /// get/set - Building maximum estimated value.
        /// </summary>
        /// <value></value>
        public decimal? MaxEstimatedValue { get; set; }

        /// <summary>
        /// get/set - Property minimum assessed value.
        /// </summary>
        /// <value></value>
        public decimal? MinAssessedValue { get; set; }

        /// <summary>
        /// get/set - Property maximum assessed value.
        /// </summary>
        /// <value></value>
        public decimal? MaxAssessedValue { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyFilter class.
        /// </summary>
        public PropertyFilter() { }

        /// <summary>
        /// Creates a new instance of a PropertyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        public PropertyFilter(double neLat, double neLong, double swLat, double swLong)
        {
            this.NELatitude = neLat;
            this.NELongitude = neLong;
            this.SWLatitude = swLat;
            this.SWLongitude = swLong;
        }

        /// <summary>
        /// Creates a new instance of a PropertyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="agencyId"></param>
        /// <param name="classificationId"></param>
        /// <param name="minEstimatedValue"></param>
        /// <param name="maxEstimatedValue"></param>
        /// <param name="minAssessedValue"></param>
        /// <param name="maxAssessedValue"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public PropertyFilter(string address, int? agencyId, int? classificationId, decimal? minEstimatedValue, decimal? maxEstimatedValue, decimal? minAssessedValue, decimal? maxAssessedValue, string[] sort)
        {
            this.Address = address;
            this.ClassificationId = classificationId;
            this.MinEstimatedValue = minEstimatedValue;
            this.MaxEstimatedValue = maxEstimatedValue;
            this.MinAssessedValue = minAssessedValue;
            this.MaxAssessedValue = maxAssessedValue;
            if (agencyId.HasValue)
                this.Agencies = new[] { agencyId.Value };
            this.Sort = sort;
        }

        /// <summary>
        /// Creates a new instance of a PropertyFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public PropertyFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.NELatitude = filter.GetDoubleNullValue(nameof(this.NELatitude));
            this.NELongitude = filter.GetDoubleNullValue(nameof(this.NELongitude));
            this.SWLatitude = filter.GetDoubleNullValue(nameof(this.SWLatitude));
            this.SWLongitude = filter.GetDoubleNullValue(nameof(this.SWLongitude));

            this.ProjectNumber = filter.GetStringValue(nameof(this.ProjectNumber));
            this.IgnorePropertiesInProjects = filter.GetBoolNullValue(nameof(this.IgnorePropertiesInProjects));
            this.InSurplusPropertyProgram = filter.GetBoolNullValue(nameof(this.InSurplusPropertyProgram));
            this.Address = filter.GetStringValue(nameof(this.Address));
            this.AdministrativeArea = filter.GetStringValue(nameof(this.AdministrativeArea));

            this.ClassificationId = filter.GetIntNullValue(nameof(this.ClassificationId));
            this.Description = filter.GetStringValue(nameof(this.Description));
            this.MinEstimatedValue = filter.GetDecimalNullValue(nameof(this.MinEstimatedValue));
            this.MaxEstimatedValue = filter.GetDecimalNullValue(nameof(this.MaxEstimatedValue));
            this.MinAssessedValue = filter.GetDecimalNullValue(nameof(this.MinAssessedValue));
            this.MaxAssessedValue = filter.GetDecimalNullValue(nameof(this.MaxAssessedValue));

            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Determine if a valid filter was provided.
        /// </summary>
        /// <returns></returns>
        public override bool IsValid()
        {
            return base.IsValid()
                || this.NELatitude.HasValue
                || this.NELongitude.HasValue
                || this.SWLatitude.HasValue
                || this.SWLongitude.HasValue
                || !String.IsNullOrWhiteSpace(this.ProjectNumber)
                || this.IgnorePropertiesInProjects == true
                || this.InSurplusPropertyProgram == true
                || !String.IsNullOrWhiteSpace(this.Address)
                || !String.IsNullOrWhiteSpace(this.AdministrativeArea)
                || !String.IsNullOrWhiteSpace(this.Description)
                || this.MaxAssessedValue.HasValue
                || this.MinAssessedValue.HasValue
                || this.MinEstimatedValue.HasValue
                || this.MaxEstimatedValue.HasValue
                || this.Agencies?.Any() == true
                || this.ClassificationId.HasValue;
        }
        #endregion
    }
}
