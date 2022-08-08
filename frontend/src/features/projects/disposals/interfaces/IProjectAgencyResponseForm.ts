import { AgencyResponses } from 'features/projects/constants';

export interface IProjectAgencyResponseForm {
  agencyId: number;
  agencyCode: string;
  notificationId: number | '';
  response: AgencyResponses;
  receivedOn: Date | '';
  note: string;
  offerAmount: number;
}
