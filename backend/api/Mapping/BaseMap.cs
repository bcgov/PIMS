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
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.ToBase64String(src.RowVersion));

            config.NewConfig<Models.BaseModel, Entity.BaseEntity>()
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.FromBase64String(src.RowVersion));
        }
    }
}
