import config from '@/constants/config';
import credentials from '@/constants/credentials';
import urls from '@/constants/urls';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';

let _token: TokenResponse = null;

const decodeJWT = (jwt: string) => {
  try {
    return JSON.parse(Buffer.from(jwt, 'base64').toString('ascii'));
  } catch {
    throw new Error('Invalid input in decodeJWT()');
  }
};

interface TokenResponse {
  access_token: string;
}

interface KeycloakPayload {
  exp: number;
}

const readToken = (token: TokenResponse) => {
  const [header, payload] = token.access_token.split('.');
  const info = {
    header: decodeJWT(header),
    payload: decodeJWT(payload) as KeycloakPayload,
  };
  return info;
};

const getTokenAsync = async (username: string, password: string): Promise<TokenResponse> => {
  const creds = btoa(`${username}:${password}`);
  const headers = {
    Authorization: `Basic ${creds}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const content = new URLSearchParams({
    grant_type: 'client_credentials',
  });
  const result = await fetch(urls.CHES.AUTH, {
    headers: headers,
    body: content.toString(),
    method: 'POST',
  });
  const text = await result.text();
  if (text.length) {
    const parse = JSON.parse(text);
    return parse;
  } else {
    return null;
  }
};

const generateUrl = (endpoint: string) => {
  return `${process.env.CHES_HOST_URI}${endpoint}`;
};

const refreshTokenAsync = async () => {
  if (!_token || new Date(readToken(_token).payload.exp) <= new Date()) {
    _token = await getTokenAsync(credentials.ches.user, credentials.ches.pass);
  }
};

const sendAsync = async (endpoint: string, method: string, data: Record<string, any> = null) => {
  await refreshTokenAsync();
  const url = generateUrl(endpoint);

  const headers = {
    Authorization: `Bearer ${_token.access_token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    headers: headers,
    method: method,
    body: data ? JSON.stringify(data) : undefined,
  });

  const text = await response.text();
  if (text.length) {
    return JSON.parse(text);
  } else {
    return {};
  }
};

export enum EmailBody {
  Html = 'html',
  Text = 'text',
}

enum EmailEncoding {
  Utf8 = 'utf-8',
  Base64 = 'base64',
  Binary = 'binary',
  Hex = 'hex',
}

enum EmailPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

interface IEmailAttachment {
  content: string;
  contentType: string;
  encoding: string;
  filename: string;
}

export interface IEmail {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  bodyType: EmailBody;
  encoding?: EmailEncoding;
  priority?: EmailPriority;
  subject: string;
  body: string;
  tag?: string;
  sendOn?: Date;
  attachments?: IEmailAttachment[];
}

const sendEmailAsync = (email: IEmail, user: KeycloakUser) => {
  if (email == null) {
    throw new ErrorWithCode('Null argument for email.', 400);
  }

  email.from = config.ches.from ?? email.from;

  if (config.ches.bccUser) {
    email.bcc = [user.email, ...(email.bcc ?? [])];
  }
  if (config.ches.alwaysBcc && typeof config.ches.alwaysBcc === 'string') {
    email.bcc = [
      ...email.bcc,
      ...(config.ches.alwaysBcc?.split(';').map((email) => email.trim()) ?? []),
    ];
  }
  if (config.ches.overrideTo || !config.ches.emailAuthorized) {
    email.to = config.ches.overrideTo
      ? config.ches.overrideTo?.split(';').map((email) => email.trim()) ?? []
      : [user.email];
  }
  if (config.ches.alwaysDelay) {
    const numSeconds = parseInt(config.ches.alwaysDelay);
    if (!isNaN(numSeconds)) {
      email.sendOn.setSeconds(email.sendOn.getSeconds() + Number(config.ches.alwaysDelay));
    }
  }
  email.to = email.to.filter((a) => !!a);
  email.cc = email.cc?.filter((a) => !!a);
  email.bcc = email.bcc?.filter((a) => !!a);

  if (config.ches.emailEnabled) {
    return sendAsync('/email', 'POST', email);
  }
};

const chesServices = {
  getTokenAsync,
  sendEmailAsync,
};

export default chesServices;
