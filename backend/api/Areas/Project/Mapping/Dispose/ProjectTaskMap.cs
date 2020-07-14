using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectTaskMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectTask, Model.ProjectTaskModel>()
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.TaskId, src => src.TaskId)
                .Map(dest => dest.StatusId, src => src.Task == null ? 0 : src.Task.StatusId)
                .Map(dest => dest.StatusCode, src => src.Task == null ? "" : src.Task.Status.Code)
                .Map(dest => dest.Name, src => src.Task == null ? null : src.Task.Name)
                .Map(dest => dest.Description, src => src.Task == null ? null : src.Task.Description)
                .Map(dest => dest.IsOptional, src => src.Task == null ? true : src.Task.IsOptional)
                .Map(dest => dest.IsDisabled, src => src.Task == null ? true : src.Task.IsDisabled)
                .Map(dest => dest.SortOrder, src => src.Task == null ? 0 : src.Task.SortOrder)
                .Map(dest => dest.IsCompleted, src => src.IsCompleted)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectTaskModel, Entity.ProjectTask>()
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.TaskId, src => src.TaskId)
                .Map(dest => dest.IsCompleted, src => src.IsCompleted)
                .Map(dest => dest.CompletedOn, src => src.CompletedOn)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
