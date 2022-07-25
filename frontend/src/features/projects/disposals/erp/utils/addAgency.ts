import { ILookupCode } from 'actions/ILookupCode';
import { AgencyResponses } from 'features/projects/constants';

import { IProjectForm } from '../../interfaces';

interface IAddAgencyProps {
  /** The project to add the agency response to. */
  project: IProjectForm;
  /** The agency who responded. */
  agency: ILookupCode;
  /** The agency response note. */
  note: string;
  /** Whether the agency is interested or not. */
  response: AgencyResponses;
}

/**
 * Add the specified agency response to the project.
 * @param param0 The options.
 */
export const addAgency = ({ project, agency, note, response }: IAddAgencyProps) => {
  const responses = [...project.projectAgencyResponses];
  responses.push({
    agencyId: parseInt(agency.id, 10),
    agencyCode: agency.name,
    response: response,
    note: note,
    notificationId: '',
    receivedOn: '',
    offerAmount: 0,
  });
  return { ...project, projectAgencyResponses: responses };
};
