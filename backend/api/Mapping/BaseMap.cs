using Mapster;
using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping
{
    public class BaseMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BaseEntity, Models.BaseModel>()
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.UpdatedByName, src => src.UpdatedBy != null ? src.UpdatedBy.DisplayName : src.CreatedBy != null ? src.CreatedBy.DisplayName : "unknown")
                .Map(dest => dest.UpdatedByEmail, src => src.UpdatedBy != null ? src.UpdatedBy.Email : src.CreatedBy != null ? src.CreatedBy.Email : "unknown")
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.ToBase64String(src.RowVersion));

            config.NewConfig<Models.BaseModel, Entity.BaseEntity>()
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.FromBase64String(src.RowVersion));
        }
    }
}
