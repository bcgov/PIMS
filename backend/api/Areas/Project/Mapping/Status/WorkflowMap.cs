using Mapster;
using Model = Pims.Api.Areas.Project.Models.Status;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Mapping.Status
{
    public class WorkflowMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Workflow, Model.WorkflowModel>()
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();
        }
    }
}
