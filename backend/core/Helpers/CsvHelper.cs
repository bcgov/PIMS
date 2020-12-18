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
        /// <param name="tableName"></param>
        /// <returns></returns>
        public static DataTable ConvertToDataTable<T>(this IEnumerable<T> data, string tableName)
        {
            var dt = new DataTable()
            {
                TableName = tableName
            };
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

    /// <summary>
    /// ExportColumn private class, provides an object to maintain the original property and the column information.
    /// This is only used in the CsvHelper.
    /// </summary>
    class ExportColumn
    {
        #region Properties
        /// <summary>
        /// get/set - The original object property information.
        /// </summary>
        public PropertyInfo PropertyInfo { get; set; }

        /// <summary>
        /// get/set - The column that will contain the property value.
        /// </summary>
        public DataColumn Column { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ExportColumn object, initializes it with specified arguments.
        /// </summary>
        /// <param name="member"></param>
        /// <param name="column"></param>
        public ExportColumn(PropertyInfo member, DataColumn column)
        {
            this.PropertyInfo = member;
            this.Column = column;
        }
        #endregion
    }
}
