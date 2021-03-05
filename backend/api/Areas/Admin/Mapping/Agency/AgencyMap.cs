using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Agency;

namespace Pims.Api.Areas.Admin.Mapping.Agency
{
    public class AgencyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Agency, Model.AgencyModel>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.SendEmail, src => src.SendEmail)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Map(dest => dest.AddressTo, src => src.AddressTo)
                .Inherits<Entity.CodeEntity<int>, Api.Models.CodeModel<int>>();

            config.NewConfig<Model.AgencyModel, Entity.Agency>()
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Email, src => src.Email)
                .Map(dest => dest.SendEmail, src => src.SendEmail)
                .Map(dest => dest.ParentId, src => src.ParentId)
                .Map(dest => dest.AddressTo, src => src.AddressTo)
                .Inherits<Api.Models.CodeModel<int>, Entity.CodeEntity<int>>();
        }
    }
}
