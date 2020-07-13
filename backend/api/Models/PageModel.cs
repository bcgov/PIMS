using Pims.Dal.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Models
{
    /// <summary>
    /// PageModel class, provides a model that represents a single page of items.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PageModel<T>
    {
        #region Properties
        /// <summary>
        /// get/set - The items on the page.
        /// </summary>
        public IEnumerable<T> Items { get; set; }

        /// <summary>
        /// get/set - The page number.
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// get/set - The requested number of item per page.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// get/set - The total items for the specified type and query (not the number of items on the page).
        /// </summary>
        public int Total { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a PageModel of type 'T'.
        /// </summary>
        public PageModel() { }

        /// <summary>
        /// Create a new instance of a PageModel of type 'T', initialize with specified arguments.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        public PageModel(IEnumerable<T> items, int page = 1, int quantity = 10)
            : this(items, page, quantity, items?.Count() ?? 0)
        {
        }

        /// <summary>
        /// Create a new instance of a PageModel of type 'T', initialize with specified arguments.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="total"></param>
        public PageModel(IEnumerable<T> items, int page, int quantity, int total)
        {
            if (page < 1) throw new ArgumentException("Must be greater than or equal to 1.", nameof(page));
            if (quantity < 1) throw new ArgumentException("Must be greater than or equal to 1.", nameof(quantity));
            if (total < 0) throw new ArgumentException("Must be greater than or equal to 0.", nameof(total));

            this.Items = items ?? throw new ArgumentNullException(nameof(items));
            this.Page = page;
            this.Quantity = quantity;
            this.Total = total;
        }

        /// <summary>
        /// Create a new instance of a PageModel of type 'T', initialize with specified arguments.
        /// </summary>
        /// <param name="page"></param>
        public PageModel(Paged<T> page)
            : this(page.Items, page.Page, page.Quantity, page.Total)
        {
        }
        #endregion
    }
}
