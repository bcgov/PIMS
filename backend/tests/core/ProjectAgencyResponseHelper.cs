using Pims.Dal;
using System;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// ProjectAgencyResponseHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new Project Agency Response
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.ProjectAgencyResponse CreateResponse(int projectId, int agencyId)
        {
            return new Entity.ProjectAgencyResponse()
            {
                ProjectId = projectId,
                AgencyId = agencyId,
                Note = "NOTE",
                ReceivedOn = DateTime.UtcNow,
                Response = Entity.NotificationResponses.Watch,
            };
        }

        /// <summary>
        /// Creates a default list of responses.
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static List<Entity.ProjectAgencyResponse> CreateDefaultResponses(int projectId, int agencyId)
        {
            return new List<Entity.ProjectAgencyResponse>()
            {
                CreateResponse(projectId, agencyId)
            };
        }

        /// <summary>
        /// Create a new instance of a ProjectAgencyResponse.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="projectId"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.ProjectAgencyResponse CreateResponse(this PimsContext context, int projectId, int agencyId)
        {
            var response = new Entity.ProjectAgencyResponse()
            {
                ProjectId = projectId,
                AgencyId = agencyId,
                Note = "NOTE",
                ReceivedOn = DateTime.UtcNow,
                Response = Entity.NotificationResponses.Watch,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            context.ProjectAgencyResponses.Add(response);
            return response;
        }
    }
}
