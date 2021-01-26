using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectReportService interface, provides functions to interact with project reports within the datasource.
    /// </summary>
    public interface IProjectReportService : IService
    {
        IEnumerable<ProjectReport> GetAll();
        ProjectReport Get(int id);
        IEnumerable<ProjectSnapshot> GetSnapshots(int reportId);
        IEnumerable<ProjectSnapshot> GetSnapshots(ProjectReport report);
        ProjectReport Add(ProjectReport report);
        ProjectReport Add(ProjectReport report, IEnumerable<ProjectSnapshot> snapshots);
        ProjectReport Update(ProjectReport report);
        IEnumerable<ProjectSnapshot> Refresh(int id);
        void Remove(ProjectReport report);
    }
}
