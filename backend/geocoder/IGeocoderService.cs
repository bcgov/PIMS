using Pims.Geocoder.Models;
using Pims.Geocoder.Parameters;
using System.Threading.Tasks;

namespace Pims.Geocoder
{
    public interface IGeocoderService
    {
        Task<FeatureCollectionModel> GetSiteAddressesAsync(string address, string outputFormat = "json");
        Task<FeatureCollectionModel> GetSiteAddressesAsync(AddressesParameters parameters, string outputFormat = "json");
    }
}
