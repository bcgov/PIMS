import { ILookupCode } from 'actions/ILookupCode';
import { IProjectForm } from '../../interfaces';
import { NotificationResponse } from 'hooks/api';

interface IAddAgencyProps {
  /** The project to add the agency response to. */
  project: IProjectForm;
  /** The agency who responded. */
  agency: ILookupCode;
  /** The agency response note. */
  note: string;
  /** Whether the agency is interested or not. */
  response: NotificationResponse;
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
