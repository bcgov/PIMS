using CsvHelper.Configuration;
using ExcelDataReader;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Tools.Converters.ExcelConverter.Configuration;
using Pims.Tools.Converters.ExcelConverter.Converters;
using Pims.Tools.Converters.ExcelConverter.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// Converter class, provides a way to convert Excel files to JSON.
    /// </summary>
    public class Converter : IConverter
    {
        #region Variables
        private readonly ILogger<Converter> _logger;
        private readonly JsonSerializerOptions _serialzerOptions;
        private readonly ConverterOptions _options;
        private readonly IGeoLocationConverter _geoConverter;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Converter, initializes with specified arguments.
        /// </summary>
        /// <param name="geoConverter"></param>
        /// <param name="logger"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="options"></param>
        public Converter(IGeoLocationConverter geoConverter, ILogger<Converter> logger, IOptions<JsonSerializerOptions> serializerOptions, IOptions<ConverterOptions> options)
        {
            _geoConverter = geoConverter;
            _logger = logger;
            _serialzerOptions = serializerOptions.Value;
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run each configured source and convert the supplied 'file' to the output.
        /// </summary>
        public async Task RunAsync()
        {
            foreach (var source in _options.Sources)
            {
                if (!_options.Run.Any() || _options.Run.Contains(source.Name))
                {
                    await ConvertWithDataReaderAsync(source);
                }
            }
        }

        /// <summary>
        /// Convert the specified 'file' into JSON with an OLE DB Connection, and save it to the specified 'outputPath'.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task ConvertWithOleDbConnectionAsync(SourceOptions options)
        {
            var file = new FileInfo(options.File);
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (String.IsNullOrWhiteSpace(options.Output)) throw new ArgumentException("Argument cannot be null, emtpy or whitespace.", nameof(options.Output));
            if (String.IsNullOrWhiteSpace(options.SheetName)) throw new ConfigurationException("Configuration 'Converter:{Source}:SheetName' cannot be null, emtpy or whitespace.");

            _logger.LogInformation($"Reading file '{file}'.");

            var cs = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={file};Extended Properties=\"Excel 12.0 Xml;HDR=YES\"";

            using var con = new OleDbConnection(cs);
            con.Open();

            var cmd = con.CreateCommand();
            cmd.CommandText = $"SELECT * FROM [{options.SheetName}$]";

            using var rdr = cmd.ExecuteReader();
            var query = (
                from DbDataRecord row in rdr
                select row).Select(async r => 
                {
                    var columns = new Dictionary<string, object>();

                    for (var i = 0; i < r.FieldCount; i++)
                    {
                        var name = rdr.GetName(i);
                        var colOptions = options.Columns.ContainsKey(name) ? options.Columns[name] : null;
                        var value = await GetValueAsync(colOptions, r[i], columns);
                        columns.Add(GetName(colOptions, name), value);
                    }

                    return columns;
                });

            var rows = await Task.WhenAll(query);
            var json = JsonSerializer.Serialize(rows, _serialzerOptions);
            ExportJsonFile(json, options.Output);
        }

        /// <summary>
        /// Convert the specified 'file' into JSON with the Excel DataReader, and save it to the specified 'outputPath'.
        /// </summary>
        /// <param name="options"></param>
        public async Task ConvertWithDataReaderAsync(SourceOptions options)
        {
            var file = new FileInfo(options.File);
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (String.IsNullOrWhiteSpace(options.Output)) throw new ArgumentException("Argument cannot be null, emtpy or whitespace.", nameof(options.Output));
            if (String.IsNullOrWhiteSpace(options.SheetName)) throw new ConfigurationException("Configuration 'Converter:{Source}:SheetName' cannot be null, emtpy or whitespace.");

            _logger.LogInformation($"Reading file '{file}'.");

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            var excelOptions = new ExcelReaderConfiguration()
            {
                FallbackEncoding = Encoding.GetEncoding(1252)
            };
            using var reader = ExcelReaderFactory.CreateReader(file.Open(FileMode.Open, FileAccess.Read), excelOptions);
            var worksheets = reader.AsDataSet();
            var worksheet = worksheets.Tables[options.SheetName];

            // Get column names.
            var columns = new string[worksheet.Columns.Count];

            var firstRowIsHeader = options.FirstRowIsHeaders;
            var rows = new List<Dictionary<string, object>>();

            try
            {
                foreach (var wrow in worksheet.Rows)
                {
                    var drow = wrow as DataRow;
                    if (firstRowIsHeader)
                    {
                        columns = drow.ItemArray.Select(i => $"{i}").NotNullOrWhiteSpace().ToArray();
                        for (var i = 0; i < columns.Length; i++)
                        {
                            columns[i] = $"{drow.ItemArray[i]}";
                        }
                        firstRowIsHeader = false;
                    }
                    else
                    {
                        var row = new Dictionary<string, object>();
                        for (var i = 0; i < columns.Length; i++)
                        {
                            var item = drow.ItemArray[i];
                            var type = item.GetType();

                            var colOptions = options.Columns.ContainsKey(columns[i]) ? options.Columns[columns[i]] : null;
                            var name = GetName(colOptions, columns[i]);
                            var value = await GetValueAsync(colOptions, item, row);

                            if (colOptions?.Skip != SkipOption.Never)
                            {
                                if (colOptions?.Skip == SkipOption.Always) continue;
                                if (colOptions?.Skip == SkipOption.AlreadySet && row.ContainsKey(name)) continue;
                                if (colOptions?.Skip == SkipOption.Null && (item.GetType().IsDbNull() || item == null)) continue;
                                if (colOptions?.Skip == SkipOption.NullOrEmpty && String.IsNullOrEmpty($"{item}")) continue;
                                if (colOptions?.Skip == SkipOption.NullOrWhitespace && String.IsNullOrWhiteSpace($"{item}")) continue;
                            }

                            if (colOptions?.OutputTo?.Any() ?? false)
                            {
                                for (var oi = 0; oi < colOptions.OutputTo.Length; oi++)
                                {
                                    var outputCol = colOptions.OutputTo[oi];
                                    if (row.ContainsKey(outputCol))
                                        row[outputCol] = SetValue(value, oi);
                                    else
                                        row.Add(outputCol, SetValue(value, oi));
                                }
                            }
                            else
                            {
                                row.Add(name, value);
                            }
                        }
                        rows.Add(row);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fatal error ended converter");
            }

            var json = JsonSerializer.Serialize(rows, _serialzerOptions);
            ExportJsonFile(json, options.Output);
        }

        /// <summary>
        /// Extracts the correct value from tuples.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="tupleIndex"></param>
        /// <returns></returns>
        private object SetValue(object value, int tupleIndex = 0)
        {
            if (value != null && value.GetType().IsTuple()) return ((ITuple)value)[tupleIndex]; // Double boxing, but for our purposes, okay.
            return value;
        }

        /// <summary>
        /// Get the name of the property from configuration.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private string GetName(ColumnOptions options, string name)
        {
            return options?.Name ?? name;
        }

        /// <summary>
        /// Extract, parse, convert the value to the configured output type.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="item"></param>
        /// <param name="row"></param>
        /// <returns></returns>
        private async Task<object> GetValueAsync(ColumnOptions options, object item, Dictionary<string, object> row = null)
        {
            var sourceType = item.GetType();
            var nullable = options?.Type?.Contains("?") ?? false;
            var baseType = options?.Type?.Replace("?", "") ?? "NA";
            var optionType = Type.GetType(baseType) ?? Type.GetType($"System.{baseType}") ?? sourceType;
            var destType = nullable ? typeof(Nullable<>).MakeGenericType(optionType) : optionType ?? sourceType;

            // Apply the switch.
            if (options?.ValueSwitch?.Any() ?? false)
            {
                var key = $"{item}";
                var found = options.ValueSwitch.FirstOrDefault(s => Regex.Match(key, s.Search, RegexOptions.Singleline).Success);
                item = found != null ? found.Value : item;
            }

            try
            {
                if (!String.IsNullOrWhiteSpace(options?.Converter))
                {
                    var providedValue = await GetValueAsync(null, item);

                    if (
                        (options.ConvertWhen == ConvertWhenOption.Always)
                        || (options.ConvertWhen == ConvertWhenOption.Null && providedValue != null)
                        || (options.ConvertWhen == ConvertWhenOption.NullOrEmpty && !String.IsNullOrEmpty($"{providedValue}"))
                        || (options.ConvertWhen == ConvertWhenOption.NullOrWhitespace && !String.IsNullOrWhiteSpace($"{providedValue}"))
                        || (options.ConvertWhen == ConvertWhenOption.Default && providedValue != destType.GetDefault())
                        || (options.ConvertWhen == ConvertWhenOption.NullOrDefault && providedValue != null && providedValue != destType.GetDefault())
                        )
                    {
                        return options?.Converter switch
                        {
                            "ConvertToFiscalYear" => $"{item}".ConvertToFiscalYear(nullable && (sourceType.IsDbNull() || item == null)),
                            "ConvertToDate" => $"{item}".ConvertToDate(nullable && (sourceType.IsDbNull() || item == null)),
                            "ConvertToTenancy" => $"{item}".ConvertToTenancy(),
                            "GeoLocationConverter" => await _geoConverter.GetLocationAsync($"{row[options.ConverterArgs[0]]}", $"{row[options.ConverterArgs[1]]}"),
                            "CleanCivicAddress" => $"{item}".CleanCivicAddress($"{row[options.ConverterArgs[0]]}", $"{row[options.ConverterArgs[1]]}", $"{row[options.ConverterArgs[2]]}"),
                            _ => throw new NotImplementedException()
                        };
                    }
                }

                if (destType == typeof(string))
                    return $"{item}";
                else if (optionType == destType && sourceType == destType)
                    return item;
                else if (nullable && sourceType.IsDbNull())
                {
                    if (options?.DefaultValue != null)
                        return ConvertTo(options.DefaultValue, optionType);

                    return null;
                }
                else if (sourceType.IsDbNull())
                    return destType.IsDbNull() ? null : Activator.CreateInstance(destType);
                else if (optionType == typeof(int) && sourceType == typeof(string))
                    return Int32.Parse($"{item}");
                else if (optionType == typeof(long) && sourceType == typeof(string))
                    return Int64.Parse($"{item}");
                else if (optionType == typeof(decimal) && sourceType == typeof(string))
                    return Decimal.Parse($"{item}");
                else if (optionType == typeof(double) && sourceType == typeof(string))
                    return Double.Parse($"{item}");
                else if (optionType == typeof(bool) && sourceType == typeof(string))
                {
                    // Assuming any value that doesn't parse should result in true.
                    if (!Boolean.TryParse($"{item}", out bool value))
                        return true;

                    return value;
                }
                else
                    return ConvertTo(item, optionType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Unable to convert property '{options?.Name}'='{item}', to type '{optionType?.Name}'.");
                throw;
            }
        }
        #endregion

        #region Helpers
        /// <summary>
        /// Convert the 'value' to the specified 'type'.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private object ConvertTo(object value, Type type)
        {
            if (type == typeof(int))
                return Int32.Parse($"{value}");
            else if (type == typeof(long))
                return Int64.Parse($"{value}");
            else if (type == typeof(decimal))
                return Decimal.Parse($"{value}");
            else if (type == typeof(double))
                return Double.Parse($"{value}");
            else if (type == typeof(bool))
                return Boolean.Parse($"{value}");
            else if (type == typeof(DateTime))
                return DateTime.Parse($"{value}");

            return Convert.ChangeType(value, type);
        }

        /// <summary>
        /// Save the specified 'json' to the specified 'outputPath' file.
        /// </summary>
        /// <param name="json"></param>
        /// <param name="outputPath"></param>
        private void ExportJsonFile(string json, string outputPath)
        {
            _logger.LogInformation($"Saving converted file to '{outputPath}'.");
            Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
            File.WriteAllText(outputPath, json);
        }
        #endregion
    }
}
