using Mapster;
using Model = Pims.Api.Areas.Project.Models.Workflow;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Workflow
{
    public class ProjectStatusMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectStatus, Model.ProjectStatusModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsMilestone, src => src.IsMilestone)
                .Map(dest => dest.Route, src => src.Route)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();

            config.NewConfig<Entity.WorkflowProjectStatus, Model.ProjectStatusModel>()
                .Map(dest => dest.Id, src => src.StatusId)
                .Map(dest => dest.Code, src => src.Status.Code)
                .Map(dest => dest.Name, src => src.Status.Name)
                .Map(dest => dest.GroupName, src => src.Status.GroupName)
                .Map(dest => dest.Description, src => src.Status.Description)
                .Map(dest => dest.IsMilestone, src => src.Status.IsMilestone)
                .Map(dest => dest.IsOptional, src => src.IsOptional)
                .Map(dest => dest.Workflow, src => src.Workflow.Code)
                .Map(dest => dest.Route, src => src.Status.Route);
        }
    }
}
