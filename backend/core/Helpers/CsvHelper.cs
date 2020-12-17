using CsvHelper;
using CsvHelper.Configuration;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Linq;
using System.Runtime.CompilerServices;

namespace Pims.Core.Helpers
{
    /// <summary>
    /// CsvHelper static class, provides helper methods to generate CSV data.
    /// </summary>
    public static class CsvHelper
    {
        /// <summary>
        /// Converts the specified 'data' into a CSV string.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        public static string ConvertToCSV<T>(this IEnumerable<T> data, string delimiter = ",")
        {
            using var writer = new StringWriter();
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                IgnoreBlankLines = true,
                Delimiter = delimiter,
            };
            using var csvWriter = new CsvWriter(writer, config);
            csvWriter.WriteRecords(data);
            return writer.ToString();
        }

        /// <summary>
        /// Converts the specified 'data' into a DataTable.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public static DataTable ConvertToDataTable<T>(this IEnumerable<T> data)
        {
            var dt = new DataTable();
            var columns = new Dictionary<int, ExportColumn>();
            var index = 0;
            var type = typeof(T) == typeof(Object) ? data.GetType().GetItemType() : typeof(T);
            var properties = type.GetCachedProperties();
            properties.ForEach(p =>
            {
                var pType = p.PropertyType;
                var isNullable = pType.IsGenericType && pType.GetGenericTypeDefinition() == typeof(Nullable<>);
                // Only include simple data types.
                if (pType.IsPrimitive || pType == typeof(string) || (!pType.IsEnumerable() && !pType.IsClass))
                {
                    var type = isNullable ? Nullable.GetUnderlyingType(pType) : pType;
                    if (type.IsEnum) type = typeof(string); // Need to do this because enums are converted to strings.
                    var displayAttr = p.GetCustomAttribute<DisplayNameAttribute>();
                    var name = displayAttr?.DisplayName ?? p.Name;
                    var column = new DataColumn(name, type) { AllowDBNull = isNullable || type == typeof(string) };
                    dt.Columns.Add(column);
                    columns.Add(index++, new ExportColumn(p, column));
                }
            });

            dt.BeginLoadData();
            data.ForEach(item =>
            {
                var values = columns.Select(c => c.Value.PropertyInfo.GetValue(item)).ToArray();
                dt.LoadDataRow(values, true);
            });
            dt.EndLoadData();

            return dt;
        }
    }

    class ExportColumn
    {
        #region Properties
        public PropertyInfo PropertyInfo { get; set; }
        public DataColumn Column { get; set; }
        #endregion

        #region Constructors
        public ExportColumn(PropertyInfo member, DataColumn column)
        {
            this.PropertyInfo = member;
            this.Column = column;
        }
        #endregion
    }
}
