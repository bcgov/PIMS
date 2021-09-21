using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Entities.Models;
using Pims.Dal.Security;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// AdministrativeAreaService class, provides a service layer to administrate areas within the datasource.
    /// </summary>
    public class AdministrativeAreaService : BaseService<AdministrativeArea>, IAdministrativeAreaService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AdministrativeAreaService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public AdministrativeAreaService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<AdministrativeAreaService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get the administrative area for the specified name.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public AdministrativeArea Get(string name)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));

            return this.Context.AdministrativeAreas
                .AsNoTracking()
                .FirstOrDefault(c => c.Name == name);
        }

        /// <summary>
        /// Get the administrative area for the specified id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public AdministrativeArea Get(int id)
        {
            return this.Context.AdministrativeAreas
                .FirstOrDefault(c => c.Id == id);
        }

        /// <summary>
        /// Get a page of administrative areas from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public Paged<AdministrativeArea> Get(int page, int quantity)
        {
            return Get(new AdministrativeAreaFilter(page, quantity));
        }

        /// <summary>
        /// Get a page of administrative areas from the datasource with a filter when provided.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<AdministrativeArea> Get(AdministrativeAreaFilter filter = null)
        {
            var query = this.Context.AdministrativeAreas.AsNoTracking();

            if (filter != null)
            {
                if (filter.Page < 1) filter.Page = 1;
                if (filter.Quantity < 1) filter.Quantity = 1;
                if (filter.Quantity > 50) filter.Quantity = 50;

                if (!string.IsNullOrWhiteSpace(filter.Name))
                    query = query.Where(a => EF.Functions.Like(a.Name, $"%{filter.Name}%"));
                if (!string.IsNullOrWhiteSpace(filter.Abbreviation))
                    query = query.Where(a => EF.Functions.Like(a.Abbreviation, $"%{filter.Abbreviation}%"));
                if (!string.IsNullOrWhiteSpace(filter.BoundaryType))
                    query = query.Where(a => EF.Functions.Like(a.BoundaryType, $"{filter.BoundaryType}"));
            }

            var administrativeAreas = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<AdministrativeArea>(administrativeAreas.ToArray(), filter.Page, filter.Quantity,
                query.Count());
        }

        /// <summary>
        /// Get all cities from the datasource. // TODO: This needs to be filtered by province at some point.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<AdministrativeArea> GetAll()
        {
            return this.Context.AdministrativeAreas.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified city in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(AdministrativeArea entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var city = this.Context.AdministrativeAreas.Find(entity.Id);
            if (city == null) throw new KeyNotFoundException();

            this.Context.Entry(city).CurrentValues.SetValues(entity);
            base.Update(city);
        }

        /// <summary>
        /// Remove the specified city from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(AdministrativeArea entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            var city = this.Context.AdministrativeAreas.Find(entity.Id);
            if (city == null) throw new KeyNotFoundException();

            this.Context.Entry(city).CurrentValues.SetValues(entity);
            base.Remove(city);
        }

        /// <summary>
        /// Add the specified administrative area to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Add(AdministrativeArea entity)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);
            entity.ThrowIfNull((nameof(entity)));

            base.Add(entity);
            this.Context.Entry(entity).State = EntityState.Detached;
        }

        #endregion
    }
}
