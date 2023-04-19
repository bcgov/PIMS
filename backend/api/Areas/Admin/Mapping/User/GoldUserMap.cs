using Mapster;
using Pims.Core.Extensions;
using System.Linq;

namespace Pims.Api.Areas.Admin.Mapping.GoldUser
{
    public class GoldUserMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Pims.Dal.Entities.GoldUser, Pims.Api.Areas.Admin.Models.GoldUser.GoldUser>()
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
                .Map(dest => dest.Roles, src => src.Roles)
                .Map(dest => dest.GoldUserRoles, src => src.GoldUserRoles)
                .Map(dest => dest.LastLogin, src => src.LastLogin);

            config.NewConfig<Pims.Api.Areas.Admin.Models.GoldUser.GoldUser, Pims.Dal.Entities.GoldUser>()
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
                .Map(dest => dest.GoldUserRoles, src => src.GoldUserRoles)
                .AfterMappingInline((m, e) => UpdateUser(m, e));
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0060:Remove unused parameter", Justification = "Required for signature")]
        private void UpdateUser(Pims.Api.Areas.Admin.Models.GoldUser.GoldUser model, Pims.Dal.Entities.GoldUser entity)
        {
            entity.Agencies.Where(a => a != null).ForEach(a => a.UserId = entity.Id);
        }
    }
}
