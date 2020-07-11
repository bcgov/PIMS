using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models
{
    /// <summary>
    /// PageModel class, provides a paging model.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PageModel<T>
        where T: class
    {
        #region Properties
        /// <summary>
        /// get/set - The page number.
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// get/set - The number of items per page.
        /// </summary>
        public int Quantity { get; set; }

        /// <summary>
        /// get/set - The total number of items that match the filter.
        /// </summary>
        public int Total { get; set;  }

        /// <summary>
        /// get/set - The items on the page.
        /// </summary>
        public IEnumerable<T> Items { get; set; }
        #endregion
    }
}
