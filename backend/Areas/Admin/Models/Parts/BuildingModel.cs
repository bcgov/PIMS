using System;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models.Parts
{
    public class BuildingModel
    {
        #region Properties
        public int Id { get; set; }

        public string LocalId { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        #endregion
    }
}
