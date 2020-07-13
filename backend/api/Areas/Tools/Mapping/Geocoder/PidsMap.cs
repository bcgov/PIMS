using System;
using System.Collections.Generic;
using Mapster;
using GModel = Pims.Geocoder.Models;
using Model = Pims.Api.Areas.Tools.Models.Geocoder;

namespace Pims.Api.Areas.Tools.Mapping.Geocoder
{
    /// <summary>
    /// PidsMap class, maps the model properties.
    /// </summary>
    public class PidsMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<GModel.SitePidsResponseModel, Model.SitePidsResponseModel>()
                .Map(dest => dest.SiteId, src => src.SiteID)
                .Map(dest => dest.Pids, src => StringToList(src.Pids));
        }

        private IEnumerable<string> StringToList(string commaSeparated)
        {
            return commaSeparated != null ? commaSeparated.Split(",") : Array.Empty<string>();
        }
    }
}
