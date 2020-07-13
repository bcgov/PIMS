using CsvHelper.Configuration;
using ExcelDataReader;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.OleDb;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

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
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Converter, initializes with specified arguments.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="options"></param>
        public Converter(ILogger<Converter> logger, IOptions<JsonSerializerOptions> serializerOptions, IOptions<ConverterOptions> options)
        {
            _logger = logger;
            _serialzerOptions = serializerOptions.Value;
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Run each configured source and convert the supplied 'file' to the output.
        /// </summary>
        public void Run()
        {
            foreach (var source in _options.Sources)
            {
                ConvertWithDataReader(source);
            }
        }

        /// <summary>
        /// Convert the specified 'file' into JSON with an OLE DB Connection, and save it to the specified 'outputPath'.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public void ConvertWithOleDbConnection(SourceOptions options)
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
                select row).Select(r =>
                {
                    var item = new Dictionary<string, object>
                    {
                    { GetName(options, rdr.GetName(0)), GetValue(options, GetName(options, rdr.GetName(0)), r[0]) }, // TODO: Dynamically get all columns.
                    { GetName(options, rdr.GetName(1)), GetValue(options, GetName(options, rdr.GetName(1)), r[1]) }
                    };
                    return item;
                });

            var json = JsonSerializer.Serialize(query, _serialzerOptions);
            ExportJsonFile(json, options.Output);
        }

        /// <summary>
        /// Convert the specified 'file' into JSON with the Excel DataReader, and save it to the specified 'outputPath'.
        /// </summary>
        /// <param name="options"></param>
        public void ConvertWithDataReader(SourceOptions options)
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

            var firstRowIsHeader = true;
            var rows = new List<Dictionary<string, object>>();
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
                        var name = GetName(options, columns[i]);
                        row.Add(name, GetValue(options, columns[i], item));
                    }
                    rows.Add(row);
                }
            }

            var json = JsonSerializer.Serialize(rows, _serialzerOptions);
            ExportJsonFile(json, options.Output);
        }

        /// <summary>
        /// Get the name of the property from configuration.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private string GetName(SourceOptions options, string name)
        {
            return options.Columns.ContainsKey(name) ? options.Columns[name].Name : name;
        }

        /// <summary>
        /// Extract, parse, convert the value to the configured output type.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="name"></param>
        /// <param name="item"></param>
        /// <returns></returns>
        private object GetValue(SourceOptions options, string name, object item)
        {
            var config = options.Columns.ContainsKey(name) ? options.Columns[name] : null;

            var sourceType = item.GetType();
            var nullable = config?.Type?.Contains("?") ?? false;
            var baseType = config?.Type?.Replace("?", "") ?? "NA";
            var optionType = Type.GetType(baseType) ?? Type.GetType($"System.{baseType}");
            var destType = nullable ? typeof(Nullable<>).MakeGenericType(optionType) : optionType ?? sourceType;

            // Apply the switch.
            if (config.ValueSwitch?.Any() ?? false)
            {
                var key = $"{item}";
                var found = config.ValueSwitch.FirstOrDefault(s => Regex.Match(key, s.Search, RegexOptions.Singleline).Success);
                item = found != null ? found.Value : item;
            }

            try
            {
                if (!String.IsNullOrWhiteSpace(config.Converter))
                {
                    return config.Converter switch
                    {
                        "ConvertToFiscalYear" => ConvertToFiscalYear($"{item}", nullable && (sourceType.Name == "DBNull" || item == null)),
                        "ConvertToDate" => ConvertToDate($"{item}", nullable && (sourceType.Name == "DBNull" || item == null)),
                        _ => throw new NotImplementedException()
                    };
                }

                if (destType == typeof(string))
                    return $"{item}";
                else if (optionType == destType && sourceType == destType)
                    return item;
                else if (nullable && sourceType.Name == "DBNull")
                {
                    if (config.DefaultValue != null)
                        return ConvertTo(config.DefaultValue, optionType);

                    return null;
                }
                else if (sourceType.Name == "DBNull")
                    return Activator.CreateInstance(destType);
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
                _logger.LogError(ex, $"Unable to convert property '{name}'='{item}', to type '{optionType.Name}'.");
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

        /// <summary>
        /// Extract the fiscal year from the string (i.e. "13/14" = 2014).
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        private int? ConvertToFiscalYear(string value, bool nullable = false)
        {
            if (Regex.Match(value, "[0-9]{2}/[0-9]{2}").Success)
            {
                var year = Int32.Parse(value.Split("/").Last());
                return CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(year);
            }

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to integer.");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="value"></param>
        /// <param name="nullable"></param>
        /// <returns></returns>
        private DateTime? ConvertToDate(string value, bool nullable = false)
        {
            if (Regex.Match(value, "[0-9]{2}/[0-9]{2}").Success)
            {
                var digits = Int32.Parse(value.Split("/").Last());
                var year = CultureInfo.CurrentCulture.Calendar.ToFourDigitYear(digits);
                return new DateTime(year, 1, 1);
            }
            else if (Int64.TryParse(value, out long serial))
            {
                if (serial > 59) serial -= 1; // Excel/Lotus 2/29/1900 bug.
                return new DateTime(1899, 12, 31).AddDays(serial);
            }
            else if (DateTime.TryParse(value, out DateTime date))
                return date;

            if (nullable) return null;

            throw new InvalidOperationException($"Unable to convert value '{value}' to date.");
        }
        #endregion
    }
}
