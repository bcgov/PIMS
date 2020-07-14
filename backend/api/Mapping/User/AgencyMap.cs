using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.User;

namespace Pims.Api.Mapping.User
{
    public class AgencyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Agency, Model.AgencyModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Parent, src => src.Parent)
                .Map(dest => dest.Children, src => src.Children)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Entity.CodeEntity<int>, Models.CodeModel<int>>();

            config.NewConfig<Model.AgencyModel, Entity.Agency>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ParentId, src => src.Parent == null ? (int?)null : src.Parent.Id)
                .Map(dest => dest.Parent, src => src.Parent)
                .Map(dest => dest.Children, src => src.Children)
                .Map(dest => dest.Users, src => src.Users)
                .Inherits<Models.CodeModel<int>, Entity.CodeEntity<int>>();
        }
    }
}
