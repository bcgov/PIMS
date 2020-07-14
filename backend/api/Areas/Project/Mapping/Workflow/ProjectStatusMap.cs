using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Workflow;

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
                .Map(dest => dest.WorkflowCode, src => src.Workflow.Code)
                .Map(dest => dest.SortOrder, src => src.SortOrder)
                .Map(dest => dest.Route, src => src.Status.Route)
                .Map(dest => dest.ToStatus, src => src.ToStatus);


            config.NewConfig<Entity.ProjectStatusTransition, Model.ProjectStatusModel>()
                .Map(dest => dest.Id, src => src.ToStatusId)
                .Map(dest => dest.Code, src => src.ToWorkflowStatus.Status.Code)
                .Map(dest => dest.WorkflowCode, src => src.ToWorkflowStatus.Workflow.Code)
                .Map(dest => dest.Name, src => src.ToWorkflowStatus.Status.Name)
                .Map(dest => dest.GroupName, src => src.ToWorkflowStatus.Status.GroupName)
                .Map(dest => dest.Description, src => src.ToWorkflowStatus.Status.Description)
                .Map(dest => dest.IsMilestone, src => src.ToWorkflowStatus.Status.IsMilestone)
                .Map(dest => dest.IsOptional, src => src.ToWorkflowStatus.IsOptional)
                .Map(dest => dest.SortOrder, src => src.ToWorkflowStatus.SortOrder)
                .Map(dest => dest.Route, src => src.ToWorkflowStatus.Status.Route);
        }
    }
}
