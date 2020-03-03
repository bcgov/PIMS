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
    /// PropertyClassificationService class, provides a service layer to administrate property classifications within the datasource.
    /// </summary>
    public class PropertyClassificationService : BaseService<PropertyClassification>, IPropertyClassificationService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyClassificationService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public PropertyClassificationService(PimsContext dbContext, ClaimsPrincipal user, ILogger<PropertyClassificationService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of property classifications from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<PropertyClassification> GetAllNoTracking()
        {
            var query = this.Context.PropertyClassifications.AsNoTracking();
            return query.OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// /// Get all property classifications from the datasource.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<PropertyClassification> GetAll()
        {
            return this.Context.PropertyClassifications.OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified property classification in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override PropertyClassification Update(PropertyClassification entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyClassification = this.Context.PropertyClassifications.Find(entity.Id);
            if (propertyClassification == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyClassification).CurrentValues.SetValues(entity);
            return base.Update(propertyClassification);
        }

        /// <summary>
        /// Remove the specified property classification from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(PropertyClassification entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var propertyClassification = this.Context.PropertyClassifications.Find(entity.Id);
            if (propertyClassification == null) throw new KeyNotFoundException();

            this.Context.Entry(propertyClassification).CurrentValues.SetValues(entity);
            base.Remove(propertyClassification);
        }
        #endregion
    }
}
