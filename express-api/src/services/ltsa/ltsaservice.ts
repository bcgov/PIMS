import urls from '@/constants/urls';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

export const getTokenAsync = async () => {
  const body = {
    integratorUsername: process.env.Ltsa__IntegratorUsername,
    integratorPassword: process.env.Ltsa__IntegratorPassword,
    myLtsaUserName: process.env.Ltsa__UserName,
    myLtsaUserPassword: process.env.Ltsa__UserPassword,
  };
  const response = await fetch(urls.LTSA.AUTHURL, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });
  if (!response.ok) {
    throw new ErrorWithCode('Failed to fetch data', response.status);
  } else return await response.json();
};
