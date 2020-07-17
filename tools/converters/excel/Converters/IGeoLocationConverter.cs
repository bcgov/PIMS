using System;
using System.Threading.Tasks;

namespace Pims.Tools.Converters.ExcelConverter.Converters
{
    /// <summary>
    /// IGeoLocationConverter interface, provides a way to fetch geo-locations from Data BC Geocoder.
    /// </summary>
    public interface IGeoLocationConverter
    {
        /// <summary>
        /// Make a request to Parcel BC Geocoder to find a site that matches the specified 'address' and 'city'.
        /// </summary>
        /// <param name="address"></param>
        /// <param name="city"></param>
        Task<(double Latitude, double Longitude)> GetLocationAsync(string address, string city);
    }
}
