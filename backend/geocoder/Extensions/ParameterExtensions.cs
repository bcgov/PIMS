using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Pims.Geocoder.Extensions
{
    /// <summary>
    /// ParameterExtensions static class, provides extension methods for query parameters.
    /// </summary>
    public static class ParameterExtensions
    {
        /// <summary>
        /// Converts the specified 'obj' into a dictionary.
        /// Lowercases the first letter of each property name.
        /// Only return non-null values.
        /// Lowercases boolean values.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static Dictionary<string, string> ToQueryStringDictionary<T>(this T obj)
            where T : class
        {
            return typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public)
                .ToDictionary(p => p.Name.LowercaseFirstCharacter(), p => p.PropertyType == typeof(bool) ? $"{p.GetValue(obj, null)}".ToLower() : $"{p.GetValue(obj, null)}")
                .Where(p => !String.IsNullOrWhiteSpace(p.Value))
                .ToDictionary(p => p.Key, p => p.Value);
        }

        /// <summary>
        /// Parses the query string and returns an object initialized with the specified parameters.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queryString"></param>
        /// <returns></returns>
        public static T ParseQueryString<T>(this QueryString queryString)
        {
            var query = QueryHelpers.ParseQuery(queryString.Value);

            return query.ParseQueryString<T>();
        }

        /// <summary>
        /// Parses the dictionary and returns an object initialized with the specified parameters.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public static T ParseQueryString<T>(this Dictionary<string, StringValues> parameters)
        {
            var result = Activator.CreateInstance<T>();
            var props = typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public).ToDictionary(p => p.Name.ToLower());
            foreach (var p in parameters)
            {
                var key = p.Key.ToLower();
                if (props.ContainsKey(key))
                {
                    if (props[key].PropertyType == typeof(int))
                    {
                        props[key].SetValue(result, Int32.Parse(p.Value));
                    }
                    else if (props[key].PropertyType == typeof(bool))
                    {
                        props[key].SetValue(result, Boolean.Parse(p.Value));
                    }
                    else if (props[key].PropertyType == typeof(double))
                    {
                        props[key].SetValue(result, Double.Parse(p.Value));
                    }
                    else
                    {
                        props[key].SetValue(result, $"{p.Value}");
                    }
                }
            }

            return result;
        }
    }
}
