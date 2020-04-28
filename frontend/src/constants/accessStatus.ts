export enum AccessRequestStatus {
  Approved = 'Approved',
  OnHold = 'OnHold',
  Declined = 'Declined',
}
export type AccessStatusDisplay = 'Approved' | 'On Hold' | 'Declined';

export const AccessStatusDisplayMapper: { [key in AccessRequestStatus]: AccessStatusDisplay } = {
  Approved: 'Approved',
  OnHold: 'On Hold',
  Declined: 'Declined',
};
