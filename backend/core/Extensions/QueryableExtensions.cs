using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// QueryableExtensions static class, provides extension methods for IQueryable.
    /// </summary>
    public static class QueryableExtensions
    {
        #region Variables
        private static readonly string[] _orderByDescending = new[] { "desc", "descending" };
        private static readonly MethodInfo OrderByMethod = typeof(Queryable).GetMethods().Single(method => method.Name == "OrderBy" && method.GetParameters().Length == 2);
        private static readonly MethodInfo OrderByDescendingMethod = typeof(Queryable).GetMethods().Single(method => method.Name == "OrderByDescending" && method.GetParameters().Length == 2);
        private static readonly MethodInfo GeneratePropertyPathLambdaMethod = typeof(QueryableExtensions).GetMethod(nameof(GeneratePropertyPathLambda), BindingFlags.NonPublic | BindingFlags.Static);
        #endregion

        /// <summary>
        /// Check if the specified property exists in the specified type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        private static bool PropertyExists<T>(string propertyName)
        {
            return typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) != null;
        }

        /// <summary>
        /// Order the query results by the specified property names.
        /// Each property can also specify the direction of the sort (i.e. "Name asc", "Name ascending", "Name desc", "Name descending").
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static IQueryable<T> OrderByProperty<T>(this IQueryable<T> source, params string[] propertyName)
        {
            if (propertyName == null) return source;
            var query = source;
            foreach (var prop in propertyName)
            {
                var parts = prop?.Split(' ') ?? throw new ArgumentNullException(nameof(propertyName));

                if (parts.Length > 2) throw new ArgumentOutOfRangeException(nameof(propertyName), "Argument 'propertyName' must not have more than two parts (i.e. 'Name asc' or 'Name desc')");
                if (parts.Length == 2 && _orderByDescending.Contains(parts[1].ToLower()))
                {
                    query = query.OrderByPropertyDescending(parts[0]);
                }
                else
                {
                    var rType = GetPropertyPathType<T>(parts[0]) ?? throw new InvalidOperationException($"The property path '{typeof(T).Name}.{parts[0]}' did not return a type.");
                    var convertMethod = GeneratePropertyPathLambdaMethod.MakeGenericMethod(new[] { typeof(T), rType });
                    var orderExpression = convertMethod.Invoke(null, new[] { parts[0] });
                    if (orderExpression != null)
                    {
                        var genericMethod = OrderByMethod.MakeGenericMethod(typeof(T), rType);
                        query = (IQueryable<T>)genericMethod.Invoke(null, new[] { query, orderExpression });
                    }
                    else
                    {
                        if (!PropertyExists<T>(parts[0])) continue;
                        ParameterExpression parameterExpression = Expression.Parameter(typeof(T));
                        Expression orderByProperty = Expression.Property(parameterExpression, parts[0]);
                        LambdaExpression lambda = Expression.Lambda(orderByProperty, parameterExpression);
                        MethodInfo genericMethod = OrderByMethod.MakeGenericMethod(typeof(T), orderByProperty.Type);
                        query = (IQueryable<T>)genericMethod.Invoke(null, new object[] { query, lambda });
                    }
                }

            }
            return query;
        }

        /// <summary>
        /// Order the query results by the specified property names.
        /// Any property name that doesn't exist will be ignored.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static IQueryable<T> OrderByPropertyDescending<T>(this IQueryable<T> source, params string[] propertyName)
        {
            if (propertyName == null) return source;
            var query = source;
            foreach (var prop in propertyName)
            {
                var rType = GetPropertyPathType<T>(prop);
                var convertMethod = GeneratePropertyPathLambdaMethod.MakeGenericMethod(new[] { typeof(T), rType });
                var orderExpression = convertMethod.Invoke(null, new[] { prop });
                if (orderExpression != null)
                {
                    var genericMethod = OrderByDescendingMethod.MakeGenericMethod(typeof(T), rType);
                    query = (IQueryable<T>)genericMethod.Invoke(null, new[] { query, orderExpression });
                }
                else
                {
                    if (!PropertyExists<T>(prop)) return query;
                    ParameterExpression parameterExpression = Expression.Parameter(typeof(T));
                    Expression orderByProperty = Expression.Property(parameterExpression, prop);
                    LambdaExpression lambda = Expression.Lambda(orderByProperty, parameterExpression);
                    MethodInfo genericMethod = OrderByDescendingMethod.MakeGenericMethod(typeof(T), orderByProperty.Type);
                    query = (IQueryable<T>)genericMethod.Invoke(null, new object[] { query, lambda });
                }
            }
            return query;
        }

        /// <summary>
        /// Get the 'Type' of the object specified by the 'path'.
        /// Fetches the properties from cache so that it doesn't haven't to iterate with reflection each time it is is called.
        /// </summary>
        /// <param name="path"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        private static Type GetPropertyPathType<T>(string path)
        {
            var type = typeof(T);
            foreach (var part in path.Split('.'))
            {
                var prop = type.GetCachedProperties().FirstOrDefault(p => p.Name == part) ?? throw new ArgumentException($"Property path '{type.Name}.{path}' is invalid.", nameof(path));
                type = prop.PropertyType.IsEnumerable() && prop.PropertyType != typeof(string) ? prop.PropertyType.GetItemType() : prop.PropertyType;
            }

            return type;
        }

        /// <summary>
        /// Generates a LambdaExpression for the specified 'Type' and 'path'.
        /// </summary>
        /// <param name="objectType"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public static LambdaExpression MakeSelector(this Type objectType, string path)
        {
            var parameter = Expression.Parameter(objectType, "x");
            var body = path.Split('.').Aggregate((Expression)parameter, Expression.PropertyOrField);
            return Expression.Lambda(body, parameter);
        }

        /// <summary>
        /// Generates an Expression for the specified 'path'.
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="path"></param>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="RT"></typeparam>
        /// <returns></returns>
        private static Expression<Func<T, RT>> GeneratePropertyPathLambda<T, RT>(string path)
            where T : class
        {
            if (!path.Contains('.')) return null;

            var parameter = Expression.Parameter(typeof(T), "x");
            return Expression.Lambda<Func<T, RT>>(path.Split('.').Aggregate((Expression)parameter, Expression.PropertyOrField), parameter);
        }
    }
}
