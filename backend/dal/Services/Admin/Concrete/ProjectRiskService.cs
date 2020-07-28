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
    /// ProjectRiskService class, provides a service layer to administrate risks within the datasource.
    /// </summary>
    public class ProjectRiskService : BaseService<ProjectRisk>, IProjectRiskService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectRiskService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ProjectRiskService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ProjectRiskService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of risks from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<ProjectRisk> GetAll()
        {
            return this.Context.ProjectRisks.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get the risk for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">ProjectRisk does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public ProjectRisk Get(int id)
        {
            return this.Context.ProjectRisks.Find(id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified risk in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(ProjectRisk entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var risk = this.Context.ProjectRisks.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(risk).CurrentValues.SetValues(entity);
            base.Update(risk);
        }

        /// <summary>
        /// Remove the specified risk from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(ProjectRisk entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var risk = this.Context.ProjectRisks.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(risk).CurrentValues.SetValues(entity);
            base.Remove(risk);
        }
        #endregion
    }
}
