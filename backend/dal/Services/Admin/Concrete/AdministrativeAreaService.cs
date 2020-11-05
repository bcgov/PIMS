using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

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

            var city = this.Context.AdministrativeAreas.Find(entity.Id);
            if (city == null) throw new KeyNotFoundException();

            this.Context.Entry(city).CurrentValues.SetValues(entity);
            base.Remove(city);
        }
        #endregion
    }
}
