using Microsoft.EntityFrameworkCore;
using Pims.Core.Extensions;
using System;
using System.Linq;
using System.Security.Claims;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// NotificationQueueExtensions static class, provides extension methods for notification queue.
    /// </summary>
    public static class NotificationQueueExtensions
    {
        #region Methods
        /// <summary>
        /// Generate a query for the specified 'filter'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="user"></param>
        /// <param name="filter"></param>
        /// <returns></returns>
        public static IQueryable<Entity.NotificationQueue> GenerateQuery(this PimsContext context, ClaimsPrincipal user, Entity.Models.NotificationQueueFilter filter)
        {
            filter.ThrowIfNull(nameof(user));
            filter.ThrowIfNull(nameof(filter));

            var query = context.NotificationQueue.AsNoTracking();

            if (filter.Key.HasValue)
                query = query.Where(p => p.Key == filter.Key);
            if (filter.Status.HasValue)
                query = query.Where(p => p.Status == filter.Status);
            if (filter.ProjectId.HasValue)
                query = query.Where(p => p.ProjectId == filter.ProjectId);
            if (filter.AgencyId.HasValue)
                query = query.Where(p => p.ToAgencyId == filter.AgencyId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => p.Project.ProjectNumber == filter.ProjectNumber);
            if (!String.IsNullOrWhiteSpace(filter.To))
                query = query.Where(p => EF.Functions.Like(p.To, $"%{filter.To}%"));
            if (!String.IsNullOrWhiteSpace(filter.Subject))
                query = query.Where(p => EF.Functions.Like(p.Subject, $"%{filter.Subject}%"));
            if (!String.IsNullOrWhiteSpace(filter.Body))
                query = query.Where(p => EF.Functions.Like(p.Body, $"%{filter.Body}%"));
            if (!String.IsNullOrWhiteSpace(filter.Tag))
                query = query.Where(p => EF.Functions.Like(p.Tag, $"%{filter.Tag}%"));

            if (filter.MinSendOn.HasValue)
                query = query.Where(p => p.SendOn >= filter.MinSendOn);
            if (filter.MaxSendOn.HasValue)
                query = query.Where(p => p.SendOn <= filter.MaxSendOn);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);
            else
                query = query.OrderBy(p => p.SendOn).ThenBy(p => p.Status);

            return query;
        }
        #endregion
    }
}
