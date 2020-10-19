using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IProjectSnapshotService interface, provides functions to interact with project snapshots within the datasource.
    /// </summary>
    public interface IProjectSnapshotService : IService
    {
        int Count();
        ProjectSnapshot Get(int id);
        ProjectSnapshot Add(ProjectSnapshot snapshot);
        ProjectSnapshot Update(ProjectSnapshot snapshot);
        ProjectSnapshot Refresh(int id);
        void Remove(ProjectSnapshot snapshot);
    }
}
