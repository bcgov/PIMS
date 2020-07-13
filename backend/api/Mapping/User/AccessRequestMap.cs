using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Mapping.User
{
    public class AccessRequestMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.AccessRequest, Model.AccessRequestModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles)
                .Map(dest => dest.UserId, src => src.UserId)
                .Map(dest => dest.User, src => src.User)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Model.AccessRequestModel, Entity.AccessRequest>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Status, src => src.Status)
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles)
                .Map(dest => dest.UserId, src => src.UserId)
                .Map(dest => dest.User, src => src.User)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
