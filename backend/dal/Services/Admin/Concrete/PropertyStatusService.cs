using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// PropertyStatusService class, provides a service layer to administrate property status within the datasource.
    /// </summary>
    public class PropertyStatusService : BaseService<PropertyStatus>, IPropertyStatusService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyStatusService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public PropertyStatusService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<PropertyStatusService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of property status from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<PropertyStatus> GetAll()
        {
            return this.Context.PropertyStatus.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified property status in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override PropertyStatus Update(PropertyStatus entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyStatus = this.Context.PropertyStatus.Find(entity.Id);
            if (propertyStatus == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyStatus).CurrentValues.SetValues(entity);
            return base.Update(propertyStatus);
        }

        /// <summary>
        /// Remove the specified property status from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(PropertyStatus entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyStatus = this.Context.PropertyStatus.Find(entity.Id);
            if (propertyStatus == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyStatus).CurrentValues.SetValues(entity);
            base.Remove(propertyStatus);
        }
        #endregion
    }
}
