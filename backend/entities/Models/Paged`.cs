using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// Paged generic class, provides a structure to hold a single page of items.
    /// </summary>
    /// <typeparam name="TModel"></typeparam>
    public class Paged<TModel> : ICollection<TModel>
    {
        #region Properties
        /// <summary>
        /// get/set - The page number.
        /// </summary>
        /// <value></value>
        public int Page { get; set; } = 1;

        /// <summary>
        /// get/set - The quantity that was requested in the query.  This is not the number of items in this page.
        /// </summary>
        /// <value></value>
        public int Quantity { get; set; } = 10;

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
        public List<TModel> Items { get; set; } = new List<TModel>();

        /// <summary>
        /// get/set - Number of items in the collection on the page.
        /// </summary>
        public int Count => this.Items.Count;

        /// <summary>
        /// get/set - Whether the collection is read-only.
        /// </summary>
        public bool IsReadOnly => false;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Paged class.
        /// </summary>
        public Paged() { }

        /// <summary>
        /// Creates a new instance of a Paged class, and initializes it with the specified data.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        public Paged(IEnumerable<TModel> items, int page = 1, int quantity = 10)
        {
            if (items == null) throw new ArgumentNullException(nameof(items));
            if (page < 1) throw new ArgumentOutOfRangeException(nameof(page));
            if (quantity < 1) throw new ArgumentOutOfRangeException(nameof(quantity));

            this.Items.AddRange(items);
            this.Page = page;
            this.Quantity = quantity;
            this.Total = items.Count();
        }

        /// <summary>
        /// Creates a new instance of a Paged class, and initializes it with the specified data.
        /// </summary>
        /// <param name="items"></param>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="total"></param>
        public Paged(IEnumerable<TModel> items, int page, int quantity, int total)
        {
            if (items == null) throw new ArgumentNullException(nameof(items));
            if (page < 1) throw new ArgumentOutOfRangeException(nameof(page));
            if (quantity < 1) throw new ArgumentOutOfRangeException(nameof(quantity));
            if (total < 0) throw new ArgumentOutOfRangeException(nameof(total));

            this.Items.AddRange(items);
            this.Page = page;
            this.Quantity = quantity;
            this.Total = total;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Convert the items in the page to another type via the specified 'converter'.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="converter"></param>
        /// <returns></returns>
        public Paged<T> To<T>(Func<IEnumerable<TModel>, IEnumerable<T>> converter)
        {
            if (converter == null) throw new ArgumentNullException(nameof(converter));

            return new Paged<T>(converter(this.Items), this.Page, this.Quantity, this.Total);
        }

        /// <summary>
        /// Get the enumerator for the items.
        /// </summary>
        /// <returns></returns>
        public IEnumerator<TModel> GetEnumerator()
        {
            return ((IEnumerable<TModel>)Items).GetEnumerator();
        }

        /// <summary>
        /// Get the enumerator for the items.
        /// </summary>
        /// <returns></returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return ((IEnumerable<TModel>)Items).GetEnumerator();
        }

        /// <summary>
        /// Add the item to the page.
        /// </summary>
        /// <param name="item"></param>
        public void Add(TModel item)
        {
            this.Items.Add(item);
        }

        /// <summary>
        /// Clear the items from the page.
        /// </summary>
        public void Clear()
        {
            this.Items.Clear();
        }

        /// <summary>
        /// Check if the page contains the specified 'item'.
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public bool Contains(TModel item)
        {
            return this.Items.Contains(item);
        }

        /// <summary>
        /// Copy items to the specified array.
        /// </summary>
        /// <param name="array"></param>
        /// <param name="arrayIndex"></param>
        public void CopyTo(TModel[] array, int arrayIndex)
        {
            this.Items.CopyTo(array, arrayIndex);
        }

        /// <summary>
        /// Remove the specified 'item' from the page.
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        public bool Remove(TModel item)
        {
            return this.Items.Remove(item);
        }
        #endregion
    }
}
