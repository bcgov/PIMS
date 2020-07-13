using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace Pims.Api.Helpers.Routes.Constraints
{
    /// <summary>
    /// PidConstraint class, provides a way to add a formatted PID (i.e. 123-123-123) constraint to a route template.
    /// </summary>
    public class PidConstraint : IRouteConstraint
    {
        #region Variables
        private readonly Regex _regex;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PidConstraint object.
        /// </summary>
        public PidConstraint()
        {
            _regex = new Regex(@"^[0-9]{3}-[0-9]{3}-[0-9]{3}$", RegexOptions.None, TimeSpan.FromMilliseconds(100));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Determines if the constraint matches the PID format (i.e. 123-123-123).
        /// </summary>
        /// <param name="httpContext"></param>
        /// <param name="router"></param>
        /// <param name="routeKey"></param>
        /// <param name="values"></param>
        /// <param name="routeDirection"></param>
        /// <returns></returns>
        public bool Match(HttpContext httpContext, IRouter router, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if (values.TryGetValue(routeKey, out object value))
            {
                var parameterValueString = Convert.ToString(value, CultureInfo.InvariantCulture);
                if (parameterValueString == null) return false;
                return _regex.IsMatch(parameterValueString);
            }

            return false;
        }
        #endregion
    }
}
