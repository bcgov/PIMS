using Pims.Core.Extensions;
using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// AgencyFilter class, provides a model for filtering agencies.
    /// </summary>
    public class AgencyFilter
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
        /// get/set - The name of the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The parent id of given agency.
        /// </summary>
        /// <value></value>
        public int ParentId { get; set; }

        /// <summary>
        /// get/set - account status
        /// </summary>
        /// <value></value>
        public bool? IsDisabled { get; set; }

        /// <summary>
        /// get/set - The agency ID
        /// </summary>
        /// <value></value>
        public int? Id { get; set; }

        /// <summary>
        /// get/set - An array of sorting conditions (i.e. FirstName desc, LastName asc)
        /// </summary>
        /// <value></value>
        public string[] Sort { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyFilter class.
        /// </summary>
        public AgencyFilter() { }

        /// <summary>
        /// Creates a new instance of a AgencyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        public AgencyFilter(int page, int quantity)
        {
            this.Page = page;
            this.Quantity = quantity;
        }

        /// <summary>
        /// Creates a new instance of a AgencyFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="parentId"></param>
        /// <param name="isDisabled"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public AgencyFilter(int page, int quantity, int id, String name, string description, int parentId, bool? isDisabled, string[] sort) : this(page, quantity)
        {
            this.Name = name;
            this.ParentId = parentId;
            this.IsDisabled = isDisabled;
            this.Sort = sort;
            this.Id = id;
        }

        /// <summary>
        /// Creates a new instance of a AgencyFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public AgencyFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            this.Page = filter.GetIntValue(nameof(this.Page), 1);
            this.Quantity = filter.GetIntValue(nameof(this.Quantity), 10);
            this.Name = filter.GetStringValue(nameof(this.Name));
            this.ParentId = filter.GetIntValue(nameof(this.ParentId));
            this.IsDisabled = filter.GetValue<bool?>(nameof(this.IsDisabled));
            this.Id = filter.GetIntValue(nameof(this.Id));
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
        }
        #endregion
    }
}
