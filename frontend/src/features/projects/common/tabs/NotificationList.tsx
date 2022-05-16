import React from 'react';

export interface INotificationList {
  label?: string;
  field: string;
  notifications: [];
}

export default function NotificationList({ notifications }: INotificationList) {
  return (
    <ul>
      {notifications.map(({ sendOn, id }) => (
        <li key={id}>
          <div>
            <h2>{sendOn}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
