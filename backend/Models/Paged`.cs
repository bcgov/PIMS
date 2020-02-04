using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Models
{
    /// <summary>
    /// Paged generic class, provides a structure to hold a single page of items.
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    public class Paged<TModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The page number.
        /// </summary>
        /// <value></value>
        public int Page { get; set; }

        /// <summary>
        /// get/set - The quantity that was requested in the query.  This is not the number of items in this page.
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; }

        /// <summary>
        /// get/set - The total number of items in the datasource that match the query.  This is not the number of items in this page.
        /// </summary>
        /// <value></value>
        public int Total { get; set; }

        /// <summary>
        /// get/set - A collection of items in this page as the result of the query.
        /// </summary>
        /// <typeparam name="TModel"></typeparam>
        /// <returns></returns>
        public List<TModel> Items { get; set; } = new List<TModel> ();
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Paged class.
        /// </summary>
        public Paged () { }

        /// <summary>
        /// Creates a new instance of a Paged class, and initializes it with the specified data.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="total"></param>
        public Paged (IEnumerable<TModel> items, int page = 1, int quantity = 10, int total = 0)
        {
            if (items == null) throw new ArgumentNullException (nameof (items));
            if (page < 1) throw new ArgumentOutOfRangeException (nameof (page));
            if (quantity < 1) throw new ArgumentOutOfRangeException (nameof (quantity));
            if (total < 0) throw new ArgumentOutOfRangeException (nameof (total));

            this.Items.AddRange (items);
            this.Page = page;
            this.Quantity = quantity;
            this.Total = total;
        }
        #endregion
    }
}
