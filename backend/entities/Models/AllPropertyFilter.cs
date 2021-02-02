using NetTopologySuite.Geometries;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// AllPropertyFilter class, provides a filter for filtering property queries.
    /// </summary>
    public class AllPropertyFilter : PropertyFilter
    {
        #region Properties

        #region Parcel Properties
        /// <summary>
        /// get/set - The parcel PID.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - The parcel zoning.
        /// </summary>
        public string Zoning { get; set; }

        /// <summary>
        /// get/set - The parcel potential zoning.
        /// </summary>
        public string ZoningPotential { get; set; }

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

        #region Building Properties
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
        /// get/set - Whether to include properties not owned by user's agency when searching.
        /// </summary>
        public bool IncludeAllProperties { get; set; }
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AllPropertyFilter class.
        /// </summary>
        public AllPropertyFilter() { }

        /// <summary>
        /// Creates a new instance of a AllPropertyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        public AllPropertyFilter(double neLat, double neLong, double swLat, double swLong)
        {
            this.NELatitude = neLat;
            this.NELongitude = neLong;
            this.SWLatitude = swLat;
            this.SWLongitude = swLong;
        }

        /// <summary>
        /// Creates a new instance of a AllPropertyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="boundary"></param>
        public AllPropertyFilter(Envelope boundary)
        {
            this.NELatitude = boundary?.MaxY;
            this.NELongitude = boundary?.MaxX;
            this.SWLatitude = boundary?.MinY;
            this.SWLongitude = boundary?.MinX;
        }

        /// <summary>
        /// Creates a new instance of a PropertyFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public AllPropertyFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);

            this.PID = filter.GetStringValue(nameof(this.PID));
            this.Zoning = filter.GetStringValue(nameof(this.Zoning));
            this.ZoningPotential = filter.GetStringValue(nameof(this.ZoningPotential));
            this.MinLandArea = filter.GetFloatNullValue(nameof(this.MinLandArea));
            this.MaxLandArea = filter.GetFloatNullValue(nameof(this.MaxLandArea));

            this.PropertyType = Enum.TryParse(filter.GetStringValue(nameof(this.PropertyType), null), out PropertyTypes propType) ? (PropertyTypes?)propType : null;
            this.ConstructionTypeId = filter.GetIntNullValue(nameof(this.ConstructionTypeId));
            this.PredominateUseId = filter.GetIntNullValue(nameof(this.PredominateUseId));
            this.FloorCount = filter.GetIntNullValue(nameof(this.FloorCount));
            this.Tenancy = filter.GetStringValue(nameof(this.Tenancy));
            this.MinRentableArea = filter.GetFloatNullValue(nameof(this.MinRentableArea));
            this.MaxRentableArea = filter.GetFloatNullValue(nameof(this.MaxRentableArea));
            this.IncludeAllProperties = filter.GetBoolValue(nameof(this.IncludeAllProperties));
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
                || !String.IsNullOrWhiteSpace(this.PID)
                || !String.IsNullOrWhiteSpace(this.Zoning)
                || !String.IsNullOrWhiteSpace(this.ZoningPotential)
                || this.MinLandArea.HasValue
                || this.MaxLandArea.HasValue
                || this.ConstructionTypeId.HasValue
                || this.PredominateUseId.HasValue
                || this.FloorCount.HasValue
                || this.MinRentableArea.HasValue
                || this.MaxRentableArea.HasValue
                || !String.IsNullOrWhiteSpace(this.Tenancy);
        }

        /// <summary>
        /// Convert to a ParcelFilter.
        /// </summary>
        /// <param name="filter"></param>
        public static explicit operator ParcelFilter(AllPropertyFilter filter)
        {
            var parcel = new ParcelFilter
            {
                Page = filter.Page,
                Quantity = filter.Quantity,

                NELatitude = filter.NELatitude,
                NELongitude = filter.NELongitude,
                SWLatitude = filter.SWLatitude,
                SWLongitude = filter.SWLongitude,

                ProjectNumber = filter.ProjectNumber,
                ClassificationId = filter.ClassificationId,
                Address = filter.Address,

                PID = filter.PID,
                AdministrativeArea = filter.AdministrativeArea,
                MinLandArea = filter.MinLandArea,
                MaxLandArea = filter.MaxLandArea,
                Zoning = filter.Zoning,
                ZoningPotential = filter.ZoningPotential,

                MinMarketValue = filter.MinMarketValue,
                MaxMarketValue = filter.MaxMarketValue,
                MinAssessedValue = filter.MinAssessedValue,
                MaxAssessedValue = filter.MaxAssessedValue,

                Agencies = filter.Agencies,
                Sort = filter.Sort
            };

            return parcel;
        }

        /// <summary>
        /// Convert to a BuildingFilter.
        /// </summary>
        /// <param name="filter"></param>
        public static explicit operator BuildingFilter(AllPropertyFilter filter)
        {
            var parcel = new BuildingFilter
            {
                Page = filter.Page,
                Quantity = filter.Quantity,

                NELatitude = filter.NELatitude,
                NELongitude = filter.NELongitude,
                SWLatitude = filter.SWLatitude,
                SWLongitude = filter.SWLongitude,

                ProjectNumber = filter.ProjectNumber,
                ClassificationId = filter.ClassificationId,
                Address = filter.Address,

                AdministrativeArea = filter.AdministrativeArea,
                MinLandArea = filter.MinLandArea,
                MaxLandArea = filter.MaxLandArea,
                Zoning = filter.Zoning,
                ZoningPotential = filter.ZoningPotential,

                ConstructionTypeId = filter.ConstructionTypeId,
                PredominateUseId = filter.PredominateUseId,
                FloorCount = filter.FloorCount,
                Tenancy = filter.Tenancy,
                MinRentableArea = filter.MinRentableArea,
                MaxRentableArea = filter.MaxRentableArea,

                MinMarketValue = filter.MinMarketValue,
                MaxMarketValue = filter.MaxMarketValue,
                MinAssessedValue = filter.MinAssessedValue,
                MaxAssessedValue = filter.MaxAssessedValue,

                Agencies = filter.Agencies,
                Sort = filter.Sort
            };

            return parcel;
        }
        #endregion
    }
}
