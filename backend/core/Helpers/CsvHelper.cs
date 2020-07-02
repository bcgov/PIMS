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
            var csv = data.ConvertToCSV().Replace(",,", ",\"\",");
            using var stringReader = new StringReader(csv);
            using var reader = new CsvReader(stringReader, CultureInfo.InvariantCulture);
            // Configure the CsvReader before creating the CsvDataReader.
            using var dataReader = new CsvDataReader(reader);
            var dt = new DataTable();

            var properties = typeof(T).GetCachedProperties();
            properties.ForEach(p =>
            {
                var isNullable = p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>);
                // Skip enumerable values.
                if (!p.PropertyType.IsEnumerable())
                {
                    var type = isNullable ? Nullable.GetUnderlyingType(p.PropertyType) : p.PropertyType;
                    if (type.IsEnum || isNullable) type = typeof(string); // Need to do this because enums are converted to strings.
                    var displayAttr = p.GetCustomAttribute<DisplayNameAttribute>();
                    var name = displayAttr?.DisplayName ?? p.Name;
                    dt.Columns.Add(new DataColumn(name, type) { AllowDBNull = isNullable });
                }
            });

            dt.Load(dataReader);

            return dt;
        }
    }
}
