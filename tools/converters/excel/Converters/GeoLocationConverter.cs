using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Geocoder;
using Pims.Tools.Converters.ExcelConverter.Configuration;
using Pims.Tools.Converters.ExcelConverter.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pims.Tools.Converters.ExcelConverter.Converters
{
    /// <summary>
    /// GeoLocationConverter class, provides a way to fetch geo-locations from Data BC Geocoder.
    /// </summary>
    public class GeoLocationConverter : IGeoLocationConverter, IDisposable
    {
        #region Variables
        private readonly GeocoderOptions _options;
        private readonly IGeocoderService _service;
        private readonly StreamWriter _writer;
        private Dictionary<string, AddressModel> _cache = new Dictionary<string, AddressModel>();
        private readonly ILogger _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GeoLocationConverter, initializes with specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public GeoLocationConverter(IOptionsMonitor<GeocoderOptions> options, IGeocoderService service, ILogger<GeoLocationConverter> logger)
        {
            _options = options.CurrentValue;
            _service = service;
            _logger = logger;

            ReadCacheIntoMemory();
            _writer = new StreamWriter(File.OpenWrite(_options.CacheFile));
        }
        #endregion

        #region Methods
        /// <summary>
        /// Make a request to Parcel BC Geocoder to find a site that matches the specified 'address' and 'city'.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="city"></param>
        /// <returns></returns>
        public async Task<(double Latitude, double Longitude)> GetLocationAsync(string address, string city)
        {
            if (!_cache.ContainsKey($"{address}, {city}"))
            {
                await Task.Delay(_options.RequestDelay); // TODO: Only delay if the last request was made in shorter than the delay time.

                var response = await _service.GetSiteAddressesAsync($"{address}, {city}, BC");

                // Data BC returns coordinates in Longitude, Latitude order.
                var lng = response.Features.FirstOrDefault()?.Geometry?.Coordinates[0] ?? 0;
                var lat = response.Features.FirstOrDefault()?.Geometry?.Coordinates[1] ?? 0;

                _cache.Add($"{address}, {city}", new AddressModel(address, city, lat, lng));
                _writer.WriteLine($"\"{address}\",\"{city}\",\"{lng}\",\"{lat}\""); // Write the address to the CSV file so that future runs don't need to make a request to Geocoder.

                return (lat, lng);
            }

            var cache = _cache[$"{address}, {city}"];
            return (cache.Latitude, cache.Longitude);
        }

        /// <summary>
        /// Dispose the file stream.
        /// </summary>
        public void Dispose()
        {
            _writer.Flush();
            _writer.Dispose();
        }
        #endregion

        #region Helpers
        private void ReadCacheIntoMemory()
        {
            var config = new CsvConfiguration(CultureInfo.CurrentCulture)
            {
                Encoding = Encoding.UTF8,
                HasHeaderRecord = false,
                
                BadDataFound = (rc) =>
                {
                    _logger.LogError($"Bad data in CSV '{rc.Field}'");
                },
                MissingFieldFound = (a, i, rc) =>
                {
                    _logger.LogError($"Missing field found in CSV '{rc.Field}'");
                }
            };
            config.RegisterClassMap<AddressModelMap>();
            using var reader = new StreamReader(File.Open(_options.CacheFile, FileMode.OpenOrCreate, FileAccess.Read));
            using var csv = new CsvReader(reader, config, true);
            var rows = csv.GetRecords<AddressModel>();
            _cache = rows.ToDictionary(r => $"{r.CivicAddress}, {r.City}", r => r);
        }
        #endregion
    }
}
