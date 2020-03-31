using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ParcelService class, provides a service layer to administrate parcel objects within the datasource.
    /// </summary>
    public class ParcelService : BaseService<Parcel>, IParcelService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public ParcelService(PimsContext dbContext, ClaimsPrincipal user, ILogger<ParcelService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of parcels.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public Paged<Parcel> Get(int page, int quantity, string sort)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var entities = this.Context.Parcels.AsNoTracking();
            var pagedEntities = entities.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<Parcel>(pagedEntities, page, quantity, entities.Count());
        }

        /// <summary>
        /// Get the parcel for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .AsNoTracking().SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the parcel for the specified 'pid'.
        /// </summary>
        /// <param name="pid"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel GetByPid(int pid)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .AsNoTracking().SingleOrDefault(u => u.PID == pid) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add the specified parcel to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Parcel Add(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.Context.Parcels.ThrowIfNotUnique(entity);

            var userId = this.User.GetUserId();
            entity.Buildings.ForEach(b =>
            {
                b.CreatedById = userId;
                this.Context.Buildings.Add(b);

                b.Evaluations.ForEach(e =>
                {
                    e.CreatedById = userId;
                    this.Context.BuildingEvaluations.Add(e);
                });

                if (b.Address != null)
                {
                    b.Address.CreatedById = userId;
                }
            });

            entity.Evaluations.ForEach(e =>
            {
                e.CreatedById = userId;
                this.Context.ParcelEvaluations.Add(e);
            });

            if (entity.Address != null)
            {
                entity.Address.CreatedById = userId;
            }

            return base.Add(entity);
        }

        /// <summary>
        /// Add the collection of parcels to the datasource.
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> Add(IEnumerable<Parcel> entities)
        {
            entities.ThrowIfNull(nameof(entities));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var userId = this.User.GetUserId();
            entities.ForEach((entity) =>
            {
                if (entity == null) throw new ArgumentNullException();
                entity.CreatedById = userId;

                entity.Buildings.ForEach(b =>
                {
                    b.CreatedById = userId;
                    this.Context.Buildings.Add(b);

                    b.Evaluations.ForEach(e =>
                    {
                        e.CreatedById = userId;
                        this.Context.BuildingEvaluations.Add(e);
                    });

                    if (b.Address != null)
                    {
                        b.Address.CreatedById = userId;
                    }
                });

                entity.Evaluations.ForEach(e =>
                {
                    e.CreatedById = userId;
                    this.Context.ParcelEvaluations.Add(e);
                });

                if (entity.Address != null)
                {
                    entity.Address.CreatedById = userId;
                }
            });

            this.Context.Parcels.AddRange(entities);
            this.Context.CommitTransaction();
            return entities;
        }

        /// <summary>
        /// Update the specified parcel in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override Parcel Update(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var parcel = this.Context.Parcels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(parcel).CurrentValues.SetValues(entity);

            this.Context.Parcels.ThrowIfNotUnique(entity);

            // TODO: Update child properties appropriately.
            return base.Update(parcel);
        }

        /// <summary>
        /// Remove the specified parcel from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var parcel = this.Context.Parcels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(parcel).CurrentValues.SetValues(entity);
            base.Remove(parcel);
        }
        #endregion
    }
}
