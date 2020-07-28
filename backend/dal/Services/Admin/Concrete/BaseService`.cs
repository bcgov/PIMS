using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System.Security.Claims;

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
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BaseService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<BaseService> logger) : base(dbContext, user, service, logger) { }
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

            var result = this.Context.Set<ET>().Find(keyValues);
            if (result != null)
            {
                this.Context.Entry(result).State = Microsoft.EntityFrameworkCore.EntityState.Detached; // Force detach so that outside the DAL the DB cannot be manipulated.
            }
            return result;
        }

        /// <summary>
        /// Add the specified entity to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public virtual void Add(ET entity)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            this.AddOne(entity);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Add the specified entity to the in-memory collection but do not commit to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public virtual void AddOne(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            this.Context.Entry(entity).State = EntityState.Added;
        }

        /// <summary>
        /// Update the specified entity in the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual void Update(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            entity.ThrowIfRowVersionNull(nameof(entity));

            this.UpdateOne(entity);
            this.Context.CommitTransaction();
        }

        /// <summary>
        /// Update the specified entity to the in-memory collection but do not commit to the datasource.
        ///</summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public virtual void UpdateOne(ET entity)
        {
            entity.ThrowIfNull(nameof(entity));
            entity.ThrowIfRowVersionNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            this.Context.Entry(entity).State = EntityState.Modified;
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
            this.Context.Entry(entity).State = EntityState.Deleted;
        }
        #endregion
    }
}
