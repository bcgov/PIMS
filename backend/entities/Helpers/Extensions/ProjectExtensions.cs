using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ProjectExtensions static class, provides extension methods for projects.
    /// </summary>
    public static class ProjectExtensions
    {
        /// <summary>
        /// Add the passed project number to the array, and then return the result with no duplicates
        /// </summary>
        /// <param name="projectNumbers"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        private static List<string> AddProjectNumber(IEnumerable<string> projectNumbers, string projectNumber)
        {
            if (projectNumber == null)
            {
                return projectNumbers.ToList();
            }

            var updatedProjectNumbers = projectNumbers.ToList();
            updatedProjectNumbers.Add(projectNumber);
            return updatedProjectNumbers.Distinct().ToList();
        }

        /// <summary>
        /// Update the property.ProjectNumbers with the specified 'projectNumber', de-duplicating based on the numeric portion.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Property UpdateProjectNumbers(this Entity.ProjectProperty property, string projectNumber)
        {
            IEnumerable<string> projectNumbers;
            switch (property.PropertyType)
            {
                case (Entity.PropertyTypes.Land):
                    if (property.Parcel == null) throw new InvalidOperationException("Unable to update parcel project number.");
                    projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.Parcel.ProjectNumbers ?? "[]");
                    property.Parcel.ProjectNumbers = JsonSerializer.Serialize(AddProjectNumber(projectNumbers, projectNumber));
                    return property.Parcel;
                case (Entity.PropertyTypes.Building):
                    if (property.Building == null) throw new InvalidOperationException("Unable to update building project number.");
                    projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.Building.ProjectNumbers ?? "[]");
                    property.Building.ProjectNumbers = JsonSerializer.Serialize(AddProjectNumber(projectNumbers, projectNumber));
                    return property.Building;
            }

            return null;
        }

        /// <summary>
        /// Update the property.ProjectNumbers with the specified 'projectNumber', de-duplicating based on the numeric portion.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Property UpdateProjectNumbers(this Entity.Property property, string projectNumber)
        {
            IEnumerable<string> projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.ProjectNumbers ?? "[]");
            property.ProjectNumbers = JsonSerializer.Serialize(AddProjectNumber(projectNumbers, projectNumber));
            return property;
        }

        /// <summary>
        /// Update the property.ProjectNumbers with the specified 'projectNumber', de-duplicating based on the numeric portion.
        /// </summary>
        /// <param name="projectProperty"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Models.ProjectProperty UpdateProjectNumbers(this Entity.Models.ProjectProperty projectProperty, string projectNumber)
        {
            IEnumerable<string> projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(projectProperty.ProjectNumbers ?? "[]");
            projectProperty.ProjectNumbers = JsonSerializer.Serialize(AddProjectNumber(projectNumbers, projectNumber));
            return projectProperty;
        }

        /// <summary>
        /// Remove from the property.ProjectNumbers using the specified 'projectNumber'.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Property RemoveProjectNumber(this Entity.ProjectProperty property, string projectNumber)
        {
            IEnumerable<string> projectNumbers;
            switch (property.PropertyType)
            {
                case (Entity.PropertyTypes.Land):
                    if (property.Parcel == null) throw new InvalidOperationException("Unable to update parcel project number.");
                    projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.Parcel.ProjectNumbers ?? "[]");
                    property.Parcel.ProjectNumbers = JsonSerializer.Serialize(projectNumbers.Where(p => p != projectNumber));
                    return property.Parcel;
                case (Entity.PropertyTypes.Building):
                    if (property.Building == null) throw new InvalidOperationException("Unable to update building project number.");
                    projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.Building.ProjectNumbers ?? "[]");
                    property.Building.ProjectNumbers = JsonSerializer.Serialize(projectNumbers.Where(p => p != projectNumber));
                    return property.Building;
            }

            return null;
        }


        /// <summary>
        /// Remove from the property.ProjectNumbers using the specified 'projectNumber'.
        /// </summary>
        /// <param name="property"></param>
        /// <param name="projectNumber"></param>
        /// <returns></returns>
        public static Entity.Property RemoveProjectNumber(this Entity.Property property, string projectNumber)
        {
            IEnumerable<string> projectNumbers = JsonSerializer.Deserialize<IEnumerable<string>>(property.ProjectNumbers ?? "[]");
            property.ProjectNumbers = JsonSerializer.Serialize(projectNumbers.Where(p => p != projectNumber));
            return property;
        }
    }
}
