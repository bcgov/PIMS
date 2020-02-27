using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ProvinceService class, provides a service layer to administrate provinces within the datasource.
    /// </summary>
    public class ProvinceService : BaseService<Province>, IProvinceService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProvinceService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public ProvinceService(PimsContext dbContext, ClaimsPrincipal user, ILogger<ProvinceService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of provinces from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<Province> GetNoTracking()
        {
            var query = this.Context.Provinces.AsNoTracking();
            return query.OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get all provinces from the datasource.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Province> GetAll()
        {
            return this.Context.Provinces.OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified province in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Province Update(Province entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var province = this.Context.Provinces.Find(entity.Id);
            if (province == null) throw new KeyNotFoundException();

            this.Context.Entry(province).CurrentValues.SetValues(entity);
            return base.Update(province);
        }

        /// <summary>
        /// Remove the specified province from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(Province entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var province = this.Context.Provinces.Find(entity.Id);
            if (province == null) throw new KeyNotFoundException();

            this.Context.Entry(province).CurrentValues.SetValues(entity);
            base.Remove(province);
        }
        #endregion
    }
}
