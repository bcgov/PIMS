export enum NotificationStatus {
  Accepted = 0,
  Pending = 1,
  Cancelled = 2,
  Failed = 3,
  Completed = 4,
  NotFound = 5,
  Invalid = 6,
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
    case NotificationStatus.NotFound:
      return 'Not Found';
    default:
      return 'Unknown';
  }
};
