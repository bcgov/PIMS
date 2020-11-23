using Mapster;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping.Project
{
    public class ProjectNoteMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectNote, string>()
                .Map(dest => dest, src => src.Note);
        }
    }
}
