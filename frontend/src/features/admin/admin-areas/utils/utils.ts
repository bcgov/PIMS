import { IAdministrativeArea, IApiAdminArea } from '../interfaces';

/** generate administrative area ready for use in api endpoints */
export const toApiAdminArea = (adminArea: IAdministrativeArea, name?: string): IApiAdminArea => {
  return {
    name: name ?? adminArea.name,
    boundaryType: adminArea.boundaryType ?? undefined,
    abbreviation: adminArea.abbreviation ?? undefined,
    groupName: adminArea.groupName ?? undefined,
    id: adminArea.id,
    isDisabled: adminArea.isDiabled ?? false,
    code: String(adminArea.id),
    rowVersion: adminArea.rowVersion ?? '',
    type: 'AdministrativaArea',
  };
};
