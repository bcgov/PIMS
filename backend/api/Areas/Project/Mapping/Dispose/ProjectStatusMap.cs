using Mapster;
using Model = Pims.Api.Areas.Project.Models.Dispose;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectStatusMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectStatus, Model.ProjectStatusModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Route, src => src.Route)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();
        }
    }
}
