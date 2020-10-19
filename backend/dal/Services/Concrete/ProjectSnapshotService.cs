using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ProjectSnapshotService class, provides a service layer to interact with project snapshots within the datasource.
    /// </summary>
    public class ProjectSnapshotService : BaseService<ProjectSnapshot>, IProjectSnapshotService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectSnapshotService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="notifyService"></param>
        /// <param name="options"></param>
        /// <param name="logger"></param>
        public ProjectSnapshotService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, INotificationService notifyService, IOptions<PimsOptions> options, ILogger<ProjectService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get the total number of project snapshots in the datasource.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return this.Context.ProjectSnapshots.Count();
        }

        /// <summary>
        /// Get the project snapshot for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="ArgumentNullException">Argument 'id' is required.</exception>
        /// <exception cref="KeyNotFoundException">Project snapshot does not exist in the datasource.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to view snapshot.</exception>
        /// <returns></returns>
        public ProjectSnapshot Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var snapshot = this.Context.ProjectSnapshots
                .Include(p => p.FromSnapshot)
                .FirstOrDefault(p => p.Id == id);

            return snapshot;
        }

        /// <summary>
        /// Add the specified project snapshot to the datasource, using the current financial values of the project.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'snapshot' is required.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to add snapshot.</exception>
        /// <returns></returns>
        public ProjectSnapshot Add(ProjectSnapshot snapshot)
        {
            var originalProject = this.Context.Projects
                .Include(p => p.Snapshots)
                .SingleOrDefault(p => p.Id == snapshot.ProjectId) ?? throw new KeyNotFoundException();
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            // set snapshot financials using the current values of the project.
            snapshot.Assessed = originalProject.Assessed;
            snapshot.Estimated = originalProject.Estimated;
            snapshot.GainLoss = originalProject.GainLoss;
            snapshot.InterestComponent = originalProject.InterestComponent;
            snapshot.NetBook = originalProject.NetBook;
            snapshot.NetProceeds = originalProject.NetProceeds;
            snapshot.OcgFinancialStatement = originalProject.OcgFinancialStatement;
            snapshot.ProgramCost = originalProject.ProgramCost;
            snapshot.SalesCost = originalProject.SalesCost;
            snapshot.SaleWithLeaseInPlace = originalProject.SaleWithLeaseInPlace;

            // by default, this snapshot will be compared against the previous snapshot.
            snapshot.FromSnapshot = originalProject.Snapshots.OrderByDescending(s => s.SnapshotOn).FirstOrDefault();
            snapshot.FromSnapshotId = snapshot.FromSnapshot?.Id;

            snapshot.SnapshotOn = DateTime.UtcNow;

            this.Context.ProjectSnapshots.Add(snapshot);
            this.Context.CommitTransaction();

            return snapshot;
        }

        /// <summary>
        /// Update the specified project snapshot metadata in the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'snapshot' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project snapshot rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit snapshot.</exception>
        /// <returns></returns>
        public ProjectSnapshot Update(ProjectSnapshot snapshot)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var originalSnapshot = this.Context.ProjectSnapshots
                .Include(p => p.Project)
                .SingleOrDefault(p => p.Id == snapshot.Id) ?? throw new KeyNotFoundException();

            if (originalSnapshot.IsFinal) throw new InvalidOperationException($"Unable to update FINAL project reports.");
            if (originalSnapshot.ProjectId != snapshot.ProjectId) throw new InvalidOperationException($"Changing the Project of a Project Report is not allowed.");
            if (originalSnapshot.Id == snapshot.FromSnapshotId) throw new InvalidOperationException($"Cannot compare a Project Report with itself.");

            // only update snapshot metadata fields unless the snapshot on date changes
            this.Context.Entry(originalSnapshot).CurrentValues.SetValues(snapshot);

            this.Context.SaveChanges();
            this.Context.CommitTransaction();

            return Get(originalSnapshot.Id);
        }

        /// <summary>
        /// Return a copy of the current snapshot using the current project data.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="RowVersionMissingException">Project snapshot rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project snapshot does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to edit snapshot.</exception>
        /// <returns></returns>
        public ProjectSnapshot Refresh(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var originalSnapshot = this.Context.ProjectSnapshots
                .Include(p => p.FromSnapshot)
                .Include(p => p.Project)
                .SingleOrDefault(p => p.Id == id) ?? throw new KeyNotFoundException();
            var originalProject = originalSnapshot.Project;

            // overwrite all existing snapshot data with current project data.
            originalSnapshot.Assessed = originalProject.Assessed;
            originalSnapshot.Estimated = originalProject.Estimated;
            originalSnapshot.GainLoss = originalProject.GainLoss;
            originalSnapshot.InterestComponent = originalProject.InterestComponent;
            originalSnapshot.NetBook = originalProject.NetBook;
            originalSnapshot.NetProceeds = originalProject.NetProceeds;
            originalSnapshot.OcgFinancialStatement = originalProject.OcgFinancialStatement;
            originalSnapshot.ProgramCost = originalProject.ProgramCost;
            originalSnapshot.SalesCost = originalProject.SalesCost;
            originalSnapshot.SaleWithLeaseInPlace = originalProject.SaleWithLeaseInPlace;

            // set the snapshot time to now.
            originalSnapshot.SnapshotOn = DateTime.UtcNow;

            return originalSnapshot;
        }

        /// <summary>
        /// Remove the specified snapshot from the datasource.
        /// </summary>
        /// <param name="project"></param>
        /// <exception cref="ArgumentNullException">Argument 'snapshot' is required.</exception>
        /// <exception cref="RowVersionMissingException">Project snapshot rowversion is required.</exception>
        /// <exception cref="KeyNotFoundException">Project snapshot does not exist.</exception>
        /// <exception cref="NotAuthorizedException">User does not have permission to delete snapshot.</exception>
        /// <returns></returns>
        public void Remove(ProjectSnapshot snapshot)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminProjects);

            var originalSnapshot = this.Context.ProjectSnapshots
                .SingleOrDefault(p => p.Id == snapshot.Id) ?? throw new KeyNotFoundException();
            if (originalSnapshot.IsFinal) throw new InvalidOperationException($"Unable to delete FINAL project reports.");

            this.Context.ProjectSnapshots.Remove(originalSnapshot);
            this.Context.CommitTransaction();
        }

        #endregion
    }
}
