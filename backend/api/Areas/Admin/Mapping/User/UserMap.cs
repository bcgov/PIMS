using Mapster;
using Pims.Core.Extensions;
using System.Linq;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Mapping.User
{
    public class UserMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.User, Model.UserModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.KeycloakUserId, src => src.KeycloakUserId)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.Username, src => src.Username)
                .Map(dest => dest.Position, src => src.Position)
                .Map(dest => dest.DisplayName, src => src.DisplayName)
                .Map(dest => dest.FirstName, src => src.FirstName)
                .Map(dest => dest.MiddleName, src => src.MiddleName)
                .Map(dest => dest.LastName, src => src.LastName)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.Agencies, src => src.Agencies.Select(a => a.Agency))
                .Map(dest => dest.Roles, src => src.Roles.Select(a => a.Role))
                .Map(dest => dest.LastLogin, src => src.LastLogin)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.UserModel, Entity.User>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.KeycloakUserId, src => src.KeycloakUserId)
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
                .Map(dest => dest.LastLogin, src => src.LastLogin)
                .AfterMappingInline((m, e) => UpdateUser(m, e))
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Required for signature")]
        private void UpdateUser(Model.UserModel model, Entity.User entity)
        {
            entity.Agencies.Where(a => a != null).ForEach(a => a.UserId = entity.Id);
            entity.Roles.Where(r => r != null).ForEach(r => r.UserId = entity.Id);
        }
    }
}
