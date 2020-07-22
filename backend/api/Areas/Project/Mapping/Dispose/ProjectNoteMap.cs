using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class ProjectNoteMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.ProjectNote, Model.ProjectNoteModel>()
                .EnumMappingStrategy(EnumMappingStrategy.ByValue)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.NoteType, src => src.NoteType)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ProjectNoteModel, Entity.ProjectNote>()
                .EnumMappingStrategy(EnumMappingStrategy.ByValue)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectId, src => src.ProjectId)
                .Map(dest => dest.NoteType, src => src.NoteType)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
