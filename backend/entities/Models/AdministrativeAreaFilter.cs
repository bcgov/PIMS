using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// AdministrativeAreaFilter class, provides a model for filtering administrative areas
    /// </summary>
    public class AdministrativeAreaFilter
    {
        #region Properties
        /// <summary>
        /// get/set - The page number.
        /// </summary>
        /// <value></value>
        public int Page { get; set; } = 1;

        /// <summary>
        /// get/set - The quantity to return in each page.
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; } = 10;

        /// <summary>
        /// get/set - A description of the boundary type for this area (o.e. Legal).
        /// </summary>
        public string BoundaryType { get; set; }

        /// <summary>
        /// get/set - The parent group name for this area.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - An appreviated name.
        /// </summary>
        public string Abbreviation { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyFilter class.
        /// </summary>
        public AdministrativeAreaFilter() { }

        /// <summary>
        /// Creates a new instance of a AdministrativeAreaFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        public AdministrativeAreaFilter(int page, int quantity)
        {
            this.Page = page;
            this.Quantity = quantity;
        }

        /// <summary>
        /// Creates a new instance of a AdministrativeAreaFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="name"></param>
        /// <param name="boundaryType"></param>
        /// <param name="abbreviation"></param>
        /// <returns></returns>
        public AdministrativeAreaFilter(int page, int quantity, string name, string boundaryType, string abbreviation) : this(page, quantity)
        {
            this.Name = name;
            this.BoundaryType = boundaryType;
            this.Abbreviation = abbreviation;
        }

        /// <summary>
        /// Creates a new instance of a AdministrativeAreaFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public AdministrativeAreaFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.Page = filter.GetIntValue(nameof(this.Page), 1);
            this.Quantity = filter.GetIntValue(nameof(this.Quantity), 10);
            this.Name = filter.GetStringValue(nameof(this.Name));
            this.BoundaryType = filter.GetStringValue(nameof(this.BoundaryType));
            this.Abbreviation = filter.GetStringValue(nameof(this.Abbreviation));
        }
        #endregion

    }
}
