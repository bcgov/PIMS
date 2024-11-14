import { ProjectProperty, Project } from '@/hooks/api/useProjectsApi';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';

/**
 * Converts a ProjectProperty object into a PropertyGeo object.
 *
 * @param projectProperty - The ProjectProperty object containing details about the property.
 * @param project - Optional Project object providing additional project-related information.
 * @returns A PropertyGeo object representing the geographical and property details.
 */
export const convertProjectPropertyToPropertyGeo = (
  projectProperty: ProjectProperty,
  project?: Project,
): PropertyGeo => {
  const property = projectProperty.Parcel ?? projectProperty.Building;
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [property.Location.x, property.Location.y],
    },
    properties: {
      Id: property.Id,
      Location: property.Location,
      PropertyTypeId: property.PropertyTypeId,
      ClassificationId: property.ClassificationId,
      Name: property.Name,
      AdministrativeAreaId: property.AdministrativeAreaId,
      AgencyId: property.AgencyId,
      PID: property.PID,
      PIN: property.PIN,
      Address1: property.Address1,
      ProjectStatusId: project?.StatusId,
    },
  } as PropertyGeo;
};
