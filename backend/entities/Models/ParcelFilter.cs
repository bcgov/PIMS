using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// ParcelFilter class, provides a model for filtering parcel queries.
    /// </summary>
    public class ParcelFilter : PropertyFilter
    {
        #region Properties
        /// <summary>
        /// get/set - The parcel PID.
        /// </summary>
        public string PID { get; set; }

        /// <summary>
        /// get/set - The parcel PIN.
        /// </summary>
        public string PIN { get; set; }

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
        public ParcelFilter(double neLat, double neLong, double swLat, double swLong) : base(neLat, neLong, swLat, swLong)
        {
        }

        /// <summary>
        /// Creates a new instance of a ParcelFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public ParcelFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query) : base(query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.PID = filter.GetStringValue(nameof(this.PID));
            this.PIN = filter.GetStringValue(nameof(this.PIN));
            this.Zoning = filter.GetStringValue(nameof(this.Zoning));
            this.ZoningPotential = filter.GetStringValue(nameof(this.ZoningPotential));
            this.MinLandArea = filter.GetFloatNullValue(nameof(this.MinLandArea));
            this.MaxLandArea = filter.GetFloatNullValue(nameof(this.MaxLandArea));
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
                || this.MaxLandArea.HasValue;
        }
        #endregion
    }
}
