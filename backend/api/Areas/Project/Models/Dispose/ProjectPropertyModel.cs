using Pims.Dal.Entities;
using Parcels = Pims.Api.Models.Parcel;
using Buildings = Pims.Api.Models.Building;
using System;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectPropertyModel class, provides a model to represent a project property.
    /// </summary>
    public class ProjectPropertyModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key to the relational table.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to identify the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The type of proeprty [Land, Building].
        /// </summary>
        public PropertyTypes PropertyType { get; set; }

        /// <summary>
        /// get/set - The foreign key to the parcel.
        /// </summary>
        public int? ParcelId { get; set; }

        public Parcels.ParcelModel Parcel { get; set; }

        /// <summary>
        /// get/set - The foreign key to the building.
        /// </summary>
        public int? BuildingId { get; set; }

        public Buildings.BuildingModel Building { get; set; }
        #endregion
    }
}
