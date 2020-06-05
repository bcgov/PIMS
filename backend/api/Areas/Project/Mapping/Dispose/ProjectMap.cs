using Mapster;
using Model = Pims.Api.Areas.Project.Models.Dispose;
using Entity = Pims.Dal.Entities;
using Pims.Api.Mapping.Converters;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.ProjectModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.Status, src => src.Status == null ? null : src.Status.Name)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.ProjectProperties, src => src.Properties)
                .Map(dest => dest.Tasks, src => src.Tasks)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectModel, Entity.Project>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Properties, src => src.ProjectProperties)
                .Map(dest => dest.Tasks, src => src.Tasks)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
