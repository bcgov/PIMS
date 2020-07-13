using Mapster;
using Model = Pims.Api.Areas.Tools.Models.Import;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Areas.Tools.Mapping.Import
{
    public class ProjectNoteMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectNote, Model.ProjectNoteModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.NoteType, src => src.NoteType)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}
