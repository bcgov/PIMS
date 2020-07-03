using Mapster;
using Model = Pims.Api.Areas.Project.Models.Status;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Status
{
    public class TaskMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Task, Model.TaskModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.IsOptional, src => src.IsOptional)
                .Inherits<Entity.LookupEntity<int>, Api.Models.LookupModel<int>>();
        }
    }
}
