using Mapster;
using Pims.Api.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Mapping
{
    public class PageModelMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.ForType(typeof(Entity.Models.Paged<>), typeof(PageModel<>))
                .Map(nameof(PageModel<object>.Items), nameof(PageModel<object>.Items))
                .Map(nameof(PageModel<object>.Page), nameof(PageModel<object>.Page))
                .Map(nameof(PageModel<object>.Quantity), nameof(PageModel<object>.Quantity))
                .Map(nameof(PageModel<object>.Total), nameof(PageModel<object>.Total));
        }
    }
}
