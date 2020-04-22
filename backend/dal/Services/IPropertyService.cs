using Pims.Dal.Entities.Models;
using Pims.Dal.Entities.Views;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IPropertyService interface, provides functions to interact with properties within the datasource.
    /// </summary>
    public interface IPropertyService
    {
        Paged<Property> GetPage(AllPropertyFilter filter);
        Paged<Property> GetPage(ParcelFilter filter);
        Paged<Property> GetPage(BuildingFilter filter);
    }
}
