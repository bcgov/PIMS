using System;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// BaseService abstract class, provides a generic service layer to perform CRUD operations on the datasource.
    /// </summary>
    /// <typeparam name="ET"></typeparam>
    public abstract class BaseService<ET> : Services.BaseService<ET>, IBaseService<ET> where ET : BaseEntity
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a BaseService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public BaseService(PimsContext dbContext, ClaimsPrincipal user, ILogger<BaseService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Find the entity within the datasource with the specified key values.
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public virtual ET Find(params object[] keyValues)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Set<ET>().Find(keyValues);
        }

        /// <summary>
        /// Add the specified entity to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual ET Add(ET entity)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            this.AddOne(entity);
            this.Context.CommitTransaction();

            return entity;
        }

        /// <summary>
        /// Add the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual ET AddOne(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            entity.CreatedById = this.User.GetUserId();
            this.Context.Set<ET>().Add(entity);

            return entity;
        }

        /// <summary>
        /// Update the specified entity in the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual ET Update(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            this.UpdateOne(entity);
            this.Context.CommitTransaction();

            return entity;
        }

        /// <summary>
        /// Update the specified entity to the in-memory collection but do not commit to the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual ET UpdateOne(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfRowVersionNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            entity.UpdatedById = this.User.GetUserId();
            entity.UpdatedOn = DateTime.UtcNow;
            this.Context.Set<ET>().Update(entity);

            return entity;
        }

        /// <summary>
        /// Remove the specified entity from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public virtual void Remove(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfRowVersionNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            this.RemoveOne(entity);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Remove the specified entity from the in-memory collection but do not commit to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public virtual void RemoveOne(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfRowVersionNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            this.Context.Set<ET>().Remove(entity);
        }
        #endregion
    }
}
