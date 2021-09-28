using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    /// <summary>
    /// ProjectStatusHistoryMap class, provides a way to map data from entity to model.
    /// </summary>
    public class ProjectStatusHistoryMap : IRegister
    {
        #region Methods
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectStatusHistory, Model.ProjectStatusHistoryModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.WorkflowId, src => src.WorkflowId)
                .Map(dest => dest.Workflow, src => src.Workflow.Code)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.Status, src => src.Status.Code)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
        #endregion
    }
}
