using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// PageFilter class, provides a model for filtering page queries.
    /// </summary>
    public abstract class PageFilter
    {
        #region Properties
        /// <summary>
        /// get/set - The page number.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// get/set - The quantity of pages to return in a single request.
        /// </summary>
        public int Quantity { get; set; } = 10;

        /// <summary>
        /// get/set - An array of sorting page conditions (i.e. AgencyId desc, ClassificationId asc)
        /// </summary>
        /// <value></value>
        public string[] Sort { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PageFilter class.
        /// </summary>
        public PageFilter() { }

        /// <summary>
        /// Creates a new instance of a PageFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        public PageFilter(int page, int quantity, string[] sort = null)
        {
            this.Page = page;
            this.Quantity = quantity;
            this.Sort = sort;
        }

        /// <summary>
        /// Creates a new instance of a PageFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public PageFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.Page = filter.GetIntValue(nameof(this.Page), 1);
            this.Quantity = filter.GetIntValue(nameof(this.Quantity), 10);
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Determine if a valid filter was provided.
        /// </summary>
        /// <returns></returns>
        public virtual bool IsValid()
        {
            return this.Page > 0
                && this.Quantity > 0;
        }
        #endregion
    }
}
