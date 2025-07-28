export enum AgencyResponseType {
  Unsubscribe = 0,
  Subscribe = 1,
}

export const AgencyResponseTypeLabels: Record<AgencyResponseType, string> = {
  [AgencyResponseType.Unsubscribe]: 'Unsubscribe',
  [AgencyResponseType.Subscribe]: 'Subscribe',
};
