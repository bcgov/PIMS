using CsvHelper.Configuration;
using System.Globalization;

namespace Pims.Tools.Converters.ExcelConverter.Models
{

    sealed class AddressModelMap : ClassMap<AddressModel>
    {
        public AddressModelMap()
        {
            AutoMap(CultureInfo.InvariantCulture);
            Map(m => m.CivicAddress).Index(0);
            Map(m => m.City).Index(1);
            Map(m => m.Longitude).Index(2);
            Map(m => m.Latitude).Index(3);
        }
    }
}
