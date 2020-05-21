using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectProperty class, provides an entity for the datamodel to manage what properties are associated to which projects.
    /// A ProjectProperty must link to either a Parcel or a Building, not both.
    /// </summary>
    public class ProjectProperty : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The PRIMARY KEY
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - The project.
        /// </summary>
        /// <value></value>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - The property type [Land, Building].
        /// </summary>
        /// <value></value>
        public PropertyTypes PropertyType { get; set; }

        /// <summary>
        /// get/set - The foreign key to the parcel - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int? ParcelId { get; set; }

        /// <summary>
        /// get/set - The parcel.
        /// </summary>
        /// <value></value>
        public Parcel Parcel { get; set; }


        /// <summary>
        /// get/set - The foreign key to the building - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int? BuildingId { get; set; }

        /// <summary>
        /// get/set - The building.
        /// </summary>
        /// <value></value>
        public Building Building { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectProperty class.
        /// </summary>
        public ProjectProperty() { }

        /// <summary>
        /// Create a new instance of a ProjectProperty class, initialize it with link to specified parcel.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="parcel"></param>
        public ProjectProperty(Project project, Parcel parcel)
        {
            this.ProjectNumber = project?.ProjectNumber ??
                throw new ArgumentNullException(nameof(project));
            this.Project = project;

            this.PropertyType = PropertyTypes.Land;
            this.ParcelId = parcel?.Id ??
                throw new ArgumentNullException(nameof(parcel));
            this.Parcel = parcel;
        }

        /// <summary>
        /// Create a new instance of a ProjectProperty class, initialize it with link to specified building.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="building"></param>
        public ProjectProperty(Project project, Building building)
        {
            this.ProjectNumber = project?.ProjectNumber ??
                throw new ArgumentNullException(nameof(project));
            this.Project = project;

            this.PropertyType = PropertyTypes.Building;
            this.BuildingId = building?.Id ??
                throw new ArgumentNullException(nameof(building));
            this.Building = building;
        }
        #endregion
    }
}
