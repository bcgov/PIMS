using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities.Views;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Linq;
using System.Security.Claims;
using Pims.Core.Extensions;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services
{
    /// <summary>
    /// PropertyService class, provides a service layer to interact with properties within the datasource.
    /// </summary>
    public class PropertyService : BaseService, IPropertyService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public PropertyService(PimsContext dbContext, ClaimsPrincipal user, ILogger<PropertyService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of parcel properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Property> GetPage(ParcelFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);

            var query = this.Context.GenerateQuery(this.User, filter)
                    .Include(p => p.Status)
                    .Include(p => p.Classification)
                    .Include(p => p.Agency)
                    .Include(p => p.Address)
                    .ThenInclude(a => a.City)
                    .Include(p => p.Address)
                    .ThenInclude(a => a.Province);

            var total = query.Count();
            var items = query.Select(p => new Property(p)
            {
                Status = p.Status.Name,
                Classification = p.Classification.Name,
                AddressId = p.AddressId,
                Address = $"{p.Address.Address1} {p.Address.Address2}",
                City = p.Address.City.Name,
                Province = p.Address.Province.Name,
                Agency = p.Agency.Name
            }).Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);

            return new Paged<Property>(items, filter.Page, filter.Quantity, total);
        }

        /// <summary>
        /// Get an array of building properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Property> GetPage(BuildingFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);

            var query = this.Context.GenerateQuery(this.User, filter)
                .Include(b => b.Parcel)
                .Include(b => b.Status)
                .Include(b => b.Classification)
                .Include(b => b.Agency)
                .Include(b => b.Address)
                .ThenInclude(a => a.City)
                .Include(b => b.Address)
                .ThenInclude(a => a.Province)
                .Include(b => b.BuildingConstructionType)
                .Include(b => b.BuildingPredominateUse)
                .Include(b => b.BuildingOccupantType);

            var total = query.Count();
            var items = query.Select(b => new Property(b)
            {
                PID = b.Parcel.PID,
                PIN = b.Parcel.PIN,
                Status = b.Status.Name,
                Classification = b.Classification.Name,
                Agency = b.Agency.Name,
                AddressId = b.AddressId,
                Address = $"{b.Address.Address1} {b.Address.Address2}",
                City = b.Address.City.Name,
                Province = b.Address.Province.Name,
                Postal = b.Address.Postal,
                BuildingConstructionType = b.BuildingConstructionType.Name,
                BuildingOccupantType = b.BuildingOccupantType.Name,
                BuildingPredominateUse = b.BuildingPredominateUse.Name
            }).Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);

            return new Paged<Property>(items, filter.Page, filter.Quantity, total);
        }

        /// <summary>
        /// Get an array of properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// Note that the 'parcelFilter' will control the 'page' and 'quantity'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Property> GetPage(AllPropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var parcelFilter = (ParcelFilter)filter;
            var buildingFilter = (BuildingFilter)filter;

            // If both filters are valid generate a union statement.
            if (parcelFilter.IsValid() && buildingFilter.IsValid())
            {
                var query = this.Context.GenerateQuery(this.User, filter);

                var total = query.Count();
                var items = query
                    .Skip((filter.Page - 1) * filter.Quantity)
                    .Take(filter.Quantity)
                    .ToArray();

                return new Paged<Property>(items, filter.Page, filter.Quantity, total);
            }
            else if (parcelFilter.IsValid())
            {
                return GetPage(parcelFilter);
            }

            return GetPage(buildingFilter);
        }
        #endregion
    }
}
