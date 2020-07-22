using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Status;

namespace Pims.Api.Areas.Project.Mapping.Status
{
    public class ProjectStatusMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectStatus, Model.ProjectStatusModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsMilestone, src => src.IsMilestone)
                .Map(dest => dest.IsTerminal, src => src.IsTerminal)
                .Map(dest => dest.Route, src => src.Route)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();

            config.NewConfig<Entity.WorkflowProjectStatus, Model.ProjectStatusModel>()
                .Map(dest => dest.Id, src => src.Status.Id)
                .Map(dest => dest.Description, src => src.Status.Description)
                .Map(dest => dest.IsMilestone, src => src.Status.IsMilestone)
                .Map(dest => dest.IsTerminal, src => src.Status.IsTerminal)
                .Map(dest => dest.Route, src => src.Status.Route)
                .Map(dest => dest.IsOptional, src => src.IsOptional)
                .Map(dest => dest.Name, src => src.Status.Name)
                .Map(dest => dest.Code, src => src.Status.Code)
                .Map(dest => dest.IsDisabled, src => src.Status.IsDisabled)
                .Map(dest => dest.CreatedOn, src => src.Status.CreatedOn)
                .Map(dest => dest.UpdatedOn, src => src.Status.UpdatedOn)
                .Map(dest => dest.RowVersion, src => src.Status.RowVersion)
                .Map(dest => dest.SortOrder, src => src.SortOrder);
        }
    }
}
