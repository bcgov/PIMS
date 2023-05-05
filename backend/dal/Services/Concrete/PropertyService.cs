using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities.Models;
using Pims.Dal.Entities.Views;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

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
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public PropertyService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<PropertyService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Returns the total number of properties in the database.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return this.Context.Properties.Count();
        }

        /// <summary>
        /// Get an array of properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// Note that the 'parcelFilter' will control the 'page' and 'quantity'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<ProjectProperty> Get(AllPropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var parcelFilter = (ParcelFilter)filter;
            var buildingFilter = (BuildingFilter)filter;

            if (parcelFilter.IsValid() && !buildingFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Land;
            }
            else if (!parcelFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Building;
            }

            var query = this.Context.GenerateQuery(this.User, filter);
            var properties = query.Select(x => new ProjectProperty(x)).ToArray();

            var projectNumbers = properties.SelectMany(p => JsonSerializer.Deserialize<IEnumerable<string>>(p.ProjectNumbers ?? "[]")).Distinct().ToArray();
            var statuses = from p in this.Context.ProjectProperties
                           where projectNumbers.Contains(p.Project.ProjectNumber)
                           select new { p.Project.ProjectNumber, p.Project.Status, WorkflowCode = p.Project.Workflow.Code };

            foreach (var status in statuses)
            {
                foreach (var projectProperty in properties.Where(property => property.ProjectNumbers.Contains(status.ProjectNumber)))
                {
                    projectProperty.ProjectStatus = status.Status.Code;
                    projectProperty.ProjectWorkflow = status.WorkflowCode;
                }
            }

            // TODO: Add optional paging ability to query.

            return properties;
        }


        /// <summary>
        /// Get an array of property names within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<string> GetNames(AllPropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var parcelFilter = (ParcelFilter)filter;
            var buildingFilter = (BuildingFilter)filter;

            if (parcelFilter.IsValid() && !buildingFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Land;
            }
            else if (!parcelFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Building;
            }

            var query = this.Context.GenerateQuery(this.User, filter);
            var properties = query.Where(x => !string.IsNullOrWhiteSpace(x.Name)).Select(x => x.Name).ToArray();

            return properties;
        }

        /// <summary>
        /// Get an array of properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// Note that the 'parcelFilter' will control the 'page' and 'quantity'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<PropertyModel> Search(AllPropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid()) throw new ArgumentException("Argument must have a valid filter", nameof(filter));

            var parcelFilter = (ParcelFilter)filter;
            var buildingFilter = (BuildingFilter)filter;

            if (parcelFilter.IsValid() && !buildingFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Land;
            }
            else if (!parcelFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Building;
            }

            IQueryable<Property> query = this.Context.GenerateAllPropertyQuery(this.User, filter);
            var user = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .ThenInclude(a => a.Children)
                .SingleOrDefault(u => u.Username == this.User.GetUsername()) ?? throw new KeyNotFoundException();
            var userAgencies = user.Agencies.Select(a => a.AgencyId).ToList();

            var properties = query.Select(p => new[] { Entities.PropertyTypes.Land, Entities.PropertyTypes.Subdivision }.Contains(p.PropertyTypeId) ? new ParcelModel(p, this.User) as PropertyModel : new BuildingModel(p, this.User)).ToArray();

            var projectNumbers = properties.SelectMany(p => JsonSerializer.Deserialize<IEnumerable<string>>(p.ProjectNumbers ?? "[]")).Distinct().ToArray();
            var statuses = from p in this.Context.ProjectProperties
                           where projectNumbers.Contains(p.Project.ProjectNumber)
                           select new { p.Project.ProjectNumber, p.Project.Status, WorkflowCode = p.Project.Workflow.Code, p.Project.Status.IsTerminal };

            foreach (var status in statuses.Where(s => !s.IsTerminal))
            {
                foreach (var property in properties.Where(property => property?.ProjectNumbers?.Contains(status.ProjectNumber) == true))
                {
                    property.ProjectWorkflow = status.WorkflowCode;
                }
            }

            //Conditionally removing values from each property object before returning; Ensuring that the user has the correct permissions for each property.
            return properties.Select(p =>
            {
                if (userAgencies.Contains((int)p.AgencyId) || this.User.HasClaim(c => c.Value == "admin-properties"))
                {
                    return p;
                }

                p.Name = null;
                p.Description = null;
                p.IsSensitive = true;
                p.AgencyId = null;
                p.AgencyCode = null;
                p.Agency = null;
                p.SubAgencyCode = null;
                p.SubAgency = null;
                p.Market = null;
                p.MarketFiscalYear = null;
                p.NetBook = null;
                p.NetBookFiscalYear = null;

                if (p.PropertyTypeId == Entities.PropertyTypes.Land)
                {
                    (p as ParcelModel).Zoning = null;
                    (p as ParcelModel).ZoningPotential = null;
                    (p as ParcelModel).AssessedLand = null;
                    (p as ParcelModel).AssessedLandDate = null;
                    (p as ParcelModel).AssessedBuilding = null;
                    (p as ParcelModel).AssessedBuildingDate = null;

                    return p;
                }

                if (p.PropertyTypeId == Entities.PropertyTypes.Building)
                {
                    (p as BuildingModel).LeaseExpiry = null;
                    (p as BuildingModel).OccupantName = null;
                    (p as BuildingModel).TransferLeaseOnSale = null;
                    (p as BuildingModel).Assessed = null;
                    (p as BuildingModel).AssessedDate = null;

                    return p;
                }

                return p;
            });

        }



        /// <summary>
        /// Get a page with an array of properties within the specified filters.
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

            if (parcelFilter.IsValid() && !buildingFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Land;
            }
            else if (!parcelFilter.IsValid() && buildingFilter.IsValid())
            {
                filter.PropertyType = Entities.PropertyTypes.Building;
            }

            var skip = (filter.Page - 1) * filter.Quantity;
            var query = this.Context.GenerateQuery(this.User, filter);
            var items = query
                .Skip(skip)
                .Take(filter.Quantity)
                .ToArray();

            return new Paged<Property>(items, filter.Page, filter.Quantity, query.Count());
        }
        #endregion
    }
}
