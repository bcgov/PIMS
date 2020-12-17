using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// BuildingFilter class, provides a model for filtering building queries.
    /// </summary>
    public class BuildingFilter : ParcelFilter
    {
        #region Properties
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
        public BuildingFilter(double neLat, double neLong, double swLat, double swLong) : base(neLat, neLong, swLat, swLong)
        {
        }

        /// <summary>
        /// Creates a new instance of a BuildingFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="agencyId"></param>
        /// <param name="constructionTypeId"></param>
        /// <param name="predominateUseId"></param>
        /// <param name="floorCount"></param>
        /// <param name="tenancy"></param>
        /// <param name="minRentableArea"></param>
        /// <param name="maxRentableArea"></param>
        /// <param name="minMarketValue"></param>
        /// <param name="maxMarketValue"></param>
        /// <param name="minAssessedValue"></param>
        /// <param name="maxAssessedValue"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public BuildingFilter(string address, int? agencyId, int? constructionTypeId, int? predominateUseId, int? floorCount, string tenancy, float? minRentableArea, float? maxRentableArea, decimal? minMarketValue, decimal? maxMarketValue, decimal? minAssessedValue, decimal? maxAssessedValue, string[] sort)
        {
            this.Address = address;
            this.ConstructionTypeId = constructionTypeId;
            this.PredominateUseId = predominateUseId;
            this.FloorCount = floorCount;
            this.Tenancy = tenancy;
            this.MinRentableArea = minRentableArea;
            this.MaxRentableArea = maxRentableArea;
            this.MinMarketValue = minMarketValue;
            this.MaxMarketValue = maxMarketValue;
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
        public BuildingFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.ConstructionTypeId = filter.GetIntNullValue(nameof(this.ConstructionTypeId));
            this.PredominateUseId = filter.GetIntNullValue(nameof(this.PredominateUseId));
            this.FloorCount = filter.GetIntNullValue(nameof(this.FloorCount));
            this.Tenancy = filter.GetStringValue(nameof(this.Tenancy));
            this.MinRentableArea = filter.GetFloatNullValue(nameof(this.MinRentableArea));
            this.MaxRentableArea = filter.GetFloatNullValue(nameof(this.MaxRentableArea));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Determine if the filter is specific to building criteria.
        /// </summary>
        /// <returns></returns>
        public override bool IsValid()
        {
            return base.IsValid()
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
