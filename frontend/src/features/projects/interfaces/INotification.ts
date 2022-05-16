export interface INotification {
  id: number;
  key: string;
  projectId: number;
  status: string;
  sendOn: string;
  to: string;
  subject: string;
  total: number;
  projectNumber: string;
}
