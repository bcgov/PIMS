using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pims.Api.Models.Parcel
{
    public class BuildingParcelModel : ParcelModel
    {
        public override IEnumerable<ParcelBuildingModel> Buildings { get; set; } = new List<ParcelBuildingModel>();
        public string OwnershipNote { get; set; }
        public int BuildingId { get; set; }
    }
}
