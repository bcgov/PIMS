using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Role;

namespace Pims.Api.Areas.Admin.Mapping.Role
{
    public class ClaimMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Claim, Model.ClaimModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.KeycloakRoleId, src => src.KeycloakRoleId)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.ClaimModel, Entity.Claim>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.KeycloakRoleId, src => src.KeycloakRoleId)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();


            config.NewConfig<Entity.RoleClaim, Model.ClaimModel>()
                .Map(dest => dest.Id, src => src.Claim.Id)
                .Map(dest => dest.Name, src => src.Claim.Name)
                .Map(dest => dest.Description, src => src.Claim.Description)
                .Map(dest => dest.KeycloakRoleId, src => src.Claim.KeycloakRoleId)
                .Map(dest => dest.IsDisabled, src => src.Claim.IsDisabled);

            config.NewConfig<Model.ClaimModel, Entity.RoleClaim>()
                .Map(dest => dest.RoleId, src => src.Id);
        }
    }
}
