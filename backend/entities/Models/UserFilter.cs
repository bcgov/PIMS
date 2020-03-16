using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Dal.Entities.Models
{
    /// <summary>
    /// UserFilter class, provides a model for filtering user queries.
    /// </summary>
    public class UserFilter
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
        /// get/set - The user display name.
        /// </summary>
        /// <value></value>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user last name.
        /// </summary>
        /// <value></value>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user first name.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user email.
        /// </summary>
        /// <value></value>
        public string Email { get; set; }

        /// <summary>
        /// get/set - An array of agencies.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }

        /// <summary>
        /// get/set - An array of sorting conditions (i.e. FirstName desc, LastName asc)
        /// </summary>
        /// <value></value>
        public string[] Sort { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserFilter class.
        /// </summary>
        public UserFilter() { }

        /// <summary>
        /// Creates a new instance of a UserFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        public UserFilter(int page, int quantity)
        {
            this.Page = page;
            this.Quantity = quantity;
        }

        /// <summary>
        /// Creates a new instance of a UserFilter class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="agencyId"></param>
        /// <param name="displayName"></param>
        /// <param name="lastName"></param>
        /// <param name="firstName"></param>
        /// <param name="email"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public UserFilter(int page, int quantity, int agencyId, string displayName, string lastName, string firstName, string email, string[] sort) : this(page, quantity)
        {
            this.Agencies = new[] { agencyId };
            this.DisplayName = displayName;
            this.LastName = lastName;
            this.FirstName = firstName;
            this.Email = email;
            this.Sort = sort;
        }

        /// <summary>
        /// Creates a new instance of a UserFilter class, initializes it with the specified arguments.
        /// Extracts the properties from the query string to generate the filter.
        /// </summary>
        /// <param name="query"></param>
        public UserFilter(Dictionary<string, Microsoft.Extensions.Primitives.StringValues> query)
        {
            // We want case-insensitive query parameter properties.
            var filter = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>(query, StringComparer.OrdinalIgnoreCase);
            if (filter.TryGetValue(nameof(this.Page), out Microsoft.Extensions.Primitives.StringValues pageValue) && int.TryParse(pageValue, out int page))
                this.Page = page;
            if (filter.TryGetValue(nameof(this.Quantity), out Microsoft.Extensions.Primitives.StringValues quantityValue) && int.TryParse(quantityValue, out int quantity))
                this.Quantity = quantity;
            if (filter.TryGetValue(nameof(this.DisplayName), out Microsoft.Extensions.Primitives.StringValues displayName))
                this.DisplayName = displayName;
            if (filter.TryGetValue(nameof(this.LastName), out Microsoft.Extensions.Primitives.StringValues lastName))
                this.LastName = lastName;
            if (filter.TryGetValue(nameof(this.FirstName), out Microsoft.Extensions.Primitives.StringValues firstName))
                this.FirstName = firstName;
            if (filter.TryGetValue(nameof(this.Email), out Microsoft.Extensions.Primitives.StringValues email))
                this.Email = email;
            if (filter.TryGetValue(nameof(this.Sort), out Microsoft.Extensions.Primitives.StringValues sort))
                this.Sort = sort.ToString().Split(",");
            if (filter.TryGetValue(nameof(this.Agencies), out Microsoft.Extensions.Primitives.StringValues agencies))
                this.Agencies = agencies.ToString().Split(",").Select(a => { int.TryParse(a, out int id); return id; }).Where(a => a != 0).ToArray();
        }
        #endregion
    }
}
