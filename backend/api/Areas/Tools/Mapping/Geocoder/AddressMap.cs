using Mapster;
using System;
using System.Text;
using GModel = Pims.Geocoder.Models;
using Model = Pims.Api.Areas.Tools.Models.Geocoder;

namespace Pims.Api.Areas.Tools.Mapping.Geocoder
{
    /// <summary>
    /// AddressMap class, maps the model properties.
    /// </summary>
    public class AddressMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<GModel.FeatureModel, Model.AddressModel>()
                .Map(dest => dest.SiteId, src => src.Properties.SiteID)
                .Map(dest => dest.FullAddress, src => src.Properties.FullAddress)
                .Map(dest => dest.Address1, src => GetAddress1(src.Properties))
                .Map(dest => dest.AdministrativeArea, src => GetAdministrativeArea(src.Properties))
                .Map(dest => dest.ProvinceCode, src => src.Properties.ProvinceCode)
                .Map(dest => dest.Longitude, src => GetLongtitude(src.Geometry))
                .Map(dest => dest.Latitude, src => GetLatitude(src.Geometry))
                .Map(dest => dest.Score, src => src.Properties.Score);
        }

        /// <summary>
        /// Create an address based on the model property values.
        /// </summary>
        /// <param name="properties"></param>
        /// <returns></returns>
        private string GetAddress1(GModel.PropertyModel properties)
        {
            var address = new StringBuilder();
            if (!String.IsNullOrWhiteSpace($"{ properties.CivicNumber}"))
                address.Append($"{properties.CivicNumber} ");

            if (properties.IsStreetTypePrefix && !String.IsNullOrWhiteSpace(properties.StreetType))
                address.Append($"{properties.StreetType} ");

            if (properties.IsStreetDirectionPrefix && !String.IsNullOrWhiteSpace(properties.StreetDirection))
                address.Append($"{properties.StreetDirection} ");

            if (!String.IsNullOrWhiteSpace(properties.StreetName))
                address.Append(properties.StreetName);

            if (!String.IsNullOrWhiteSpace(properties.StreetQualifier))
                address.Append($" {properties.StreetQualifier}");

            if (!properties.IsStreetDirectionPrefix && !String.IsNullOrWhiteSpace(properties.StreetDirection))
                address.Append($" {properties.StreetDirection}");

            if (!properties.IsStreetTypePrefix && !String.IsNullOrWhiteSpace(properties.StreetType))
                address.Append($" {properties.StreetType}");
            return address.ToString();
        }

        /// <summary>
        /// Get the administrative area name (city, municipality, district, etc.) based on the model property values.
        /// </summary>
        /// <param name="properties"></param>
        /// <returns></returns>
        private string GetAdministrativeArea(GModel.PropertyModel properties)
        {
            return properties.LocalityName;
        }

        /// <summary>
        /// Get the latitude from the property value.
        /// </summary>
        /// <param name="geometry"></param>
        /// <returns></returns>
        private double GetLatitude(GModel.GeometryModel geometry)
        {
            if (geometry.Coordinates?.Length == 2) return geometry.Coordinates[1];
            return 0;
        }

        /// <summary>
        /// Get the longitude from the property value.
        /// </summary>
        /// <param name="geometry"></param>
        /// <returns></returns>
        private double GetLongtitude(GModel.GeometryModel geometry)
        {
            if (geometry.Coordinates?.Length >= 1) return geometry.Coordinates[0];
            return 0;
        }
    }
}
