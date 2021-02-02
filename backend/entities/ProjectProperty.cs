using Pims.Dal.Helpers.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

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
        public int ProjectId { get; set; }

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
        public ProjectProperty(Project project, Parcel parcel) : this(project, (Property)parcel)
        {
        }

        /// <summary>
        /// Create a new instance of a ProjectProperty class, initialize it with link to specified building.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="building"></param>
        public ProjectProperty(Project project, Building building) : this(project, (Property)building)
        {
        }

        /// <summary>
        /// Create a new instance of a ProjectProperty class, initialize it with link to specified property.
        /// Also updates the property.ProjectNumber to match the project.
        /// </summary>
        /// <param name="project"></param>
        /// <param name="property"></param>
        public ProjectProperty(Project project, Property property)
        {
            this.ProjectId = project?.Id ??
                throw new ArgumentNullException(nameof(project));
            this.Project = project;

            this.PropertyType = property.GetType() == typeof(Parcel) ? PropertyTypes.Land : PropertyTypes.Building;
            property.UpdateProjectNumbers(project.ProjectNumber);

            switch (this.PropertyType)
            {
                case (PropertyTypes.Land):
                    this.ParcelId = property?.Id ??
                        throw new ArgumentNullException(nameof(property));
                    this.Parcel = property as Parcel;
                    break;
                case (PropertyTypes.Building):
                    this.BuildingId = property?.Id ??
                        throw new ArgumentNullException(nameof(property));
                    this.Building = property as Building;
                    break;
                default:
                    throw new ArgumentException("A property must be a parcel or a building.", nameof(property));
            }
        }
        #endregion
    }
}
