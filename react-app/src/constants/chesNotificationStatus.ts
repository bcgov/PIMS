export enum NotificationStatus {
  Accepted = 0,
  Pending = 1,
  Cancelled = 2,
  Failed = 3,
  Completed = 4,
}

export const getStatusString = (status: number): string => {
  switch (status) {
    case NotificationStatus.Accepted:
      return 'Accepted';
    case NotificationStatus.Pending:
      return 'Pending';
    case NotificationStatus.Cancelled:
      return 'Cancelled';
    case NotificationStatus.Failed:
      return 'Failed';
    case NotificationStatus.Completed:
      return 'Completed';
    default:
      return 'Unknown';
  }
};
