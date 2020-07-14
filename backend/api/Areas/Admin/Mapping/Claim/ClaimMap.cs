using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Claim;

namespace Pims.Api.Areas.Admin.Mapping.Claim
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
        }
    }
}
