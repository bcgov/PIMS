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
    /// PropertyTypeService class, provides a service layer to administrate property types within the datasource.
    /// </summary>
    public class PropertyTypeService : BaseService<PropertyType>, IPropertyTypeService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyTypeService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public PropertyTypeService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<PropertyTypeService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of property types from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<PropertyType> GetAll()
        {
            var query = this.Context.PropertyTypes.AsNoTracking();
            return query.OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified property type in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(PropertyType entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyType = this.Context.PropertyTypes.Find(entity.Id);
            if (propertyType == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyType).CurrentValues.SetValues(entity);
            base.Update(propertyType);
        }

        /// <summary>
        /// Remove the specified property type from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(PropertyType entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyType = this.Context.PropertyTypes.Find(entity.Id);
            if (propertyType == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyType).CurrentValues.SetValues(entity);
            base.Remove(propertyType);
        }
        #endregion
    }
}
