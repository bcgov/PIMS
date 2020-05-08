using System;
using System.Collections.Generic;
using System.Linq;
using Pims.Core.Extensions;

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
        /// get/set - The username.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

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
        /// <param name="username"></param>
        /// <param name="displayName"></param>
        /// <param name="lastName"></param>
        /// <param name="firstName"></param>
        /// <param name="email"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public UserFilter(int page, int quantity, int agencyId, string username, string displayName, string lastName, string firstName, string email, string[] sort) : this(page, quantity)
        {
            this.Agencies = new[] { agencyId };
            this.Username = username;
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
            this.Page = filter.GetIntValue(nameof(this.Page), 1);
            this.Quantity = filter.GetIntValue(nameof(this.Quantity), 10);
            this.Username = filter.GetStringValue(nameof(this.Username));
            this.DisplayName = filter.GetStringValue(nameof(this.DisplayName));
            this.LastName = filter.GetStringValue(nameof(this.LastName));
            this.FirstName = filter.GetStringValue(nameof(this.FirstName));
            this.Email = filter.GetStringValue(nameof(this.Email));
            this.Agencies = filter.GetIntArrayValue(nameof(this.Agencies)).Where(a => a != 0).ToArray();
            this.Sort = filter.GetStringArrayValue(nameof(this.Sort));
        }
        #endregion
    }
}
