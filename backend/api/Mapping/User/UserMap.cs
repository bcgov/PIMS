using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Mapping.User
{
    public class UserMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.User, Model.UserModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Username, src => src.Username)
                .Map(dest => dest.Position, src => src.Position)
                .Map(dest => dest.DisplayName, src => src.DisplayName)
                .Map(dest => dest.FirstName, src => src.FirstName)
                .Map(dest => dest.MiddleName, src => src.MiddleName)
                .Map(dest => dest.LastName, src => src.LastName)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();

            config.NewConfig<Model.UserModel, Entity.User>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Username, src => src.Username)
                .Map(dest => dest.Position, src => src.Position)
                .Map(dest => dest.DisplayName, src => src.DisplayName)
                .Map(dest => dest.FirstName, src => src.FirstName)
                .Map(dest => dest.MiddleName, src => src.MiddleName)
                .Map(dest => dest.LastName, src => src.LastName)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.Agencies, src => src.Agencies)
                .Map(dest => dest.Roles, src => src.Roles)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}
