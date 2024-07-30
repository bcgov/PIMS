import config from '@/constants/config';
import credentials from '@/constants/credentials';
import urls from '@/constants/urls';
import { ChesFilter } from '@/controllers/tools/toolsSchema';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { decodeJWT } from '@/utilities/decodeJWT';
import logger from '@/utilities/winstonLogger';
import { SSOUser } from '@bcgov/citz-imb-sso-express';

let _token: TokenResponse = null;

interface TokenResponse {
  access_token?: string;
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
  return `${urls.CHES.HOST}${endpoint}`;
};

const refreshTokenAsync = async () => {
  if (!_token?.access_token || new Date(readToken(_token).payload.exp) <= new Date()) {
    _token = await getTokenAsync(credentials.ches.user, credentials.ches.pass);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export enum EmailEncoding {
  Utf8 = 'utf-8',
  Base64 = 'base64',
  Binary = 'binary',
  Hex = 'hex',
}

export enum EmailPriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
}

interface IEmailAttachment {
  content: string;
  contentType: string;
  encoding: string;
  filename: string;
}

export interface IEmail {
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  bodyType: EmailBody;
  encoding?: EmailEncoding;
  priority?: EmailPriority;
  subject: string;
  body: string;
  tag?: string;
  delayTS?: number;
  attachments?: IEmailAttachment[];
}

export interface IEmailSentResponse {
  messages: Array<{ msgId: string; to: string }>;
  txId: string;
}

const sendEmailAsync = async (email: IEmail, user: SSOUser): Promise<IEmailSentResponse | null> => {
  const cfg = config();
  if (email == null) {
    throw new ErrorWithCode('Null argument for email.', 400);
  }

  email.from = email.from ?? cfg.ches.defaultFrom;

  if (cfg.ches.bccCurrentUser) {
    email.bcc = [user.email, ...(email.bcc ?? [])];
  }
  if (cfg.ches.usersToBcc && typeof cfg.ches.usersToBcc === 'string') {
    email.bcc = [
      ...(email.bcc ?? []),
      ...(cfg.ches.usersToBcc?.split(';').map((email) => email.trim()) ?? []),
    ];
  }
  if (cfg.ches.secondsToDelay) {
    const numSeconds = parseInt(cfg.ches.secondsToDelay);
    if (!isNaN(numSeconds)) {
      if (!email.delayTS) {
        email.delayTS = 0;
      }
      email.delayTS += Number(cfg.ches.secondsToDelay);
    }
  }
  if (cfg.ches.overrideTo || !cfg.ches.sendToLive) {
    email.to = cfg.ches.overrideTo
      ? cfg.ches.overrideTo.split(';').map((email) => email.trim())
      : [user.email];
    email.cc = email.cc?.length ? [user.email] : [];
    email.bcc = [];
  }

  email.to = email.to?.filter((a) => !!a);
  email.cc = email.cc?.filter((a) => !!a);
  email.bcc = email.bcc?.filter((a) => !!a);

  if (cfg.ches.emailEnabled) {
    return sendAsync('/email', 'POST', email);
  } else {
    return null;
  }
};

export interface IChesStatusResponse {
  status: string;
  tag: string;
  txId: string;
  updatedTS: number;
  createdTS: number;
  msgId: string;
}

const getStatusByIdAsync = async (messageId: string): Promise<IChesStatusResponse> => {
  try {
    const response: IChesStatusResponse = await sendAsync(`/status/${messageId}`, 'GET');
    if (!response) {
      throw new Error(`Failed to fetch status for messageId ${messageId}`);
    }
    return await response;
  } catch (error) {
    logger.error(`Error fetching status for messageId ${messageId}:`, error);
    return null;
  }
};

const getStatusesAsync = async (filter: ChesFilter) => {
  if (filter == null) throw new ErrorWithCode('Null filter.', 400);
  throwIfMissingParameter(filter);
  const params = new URLSearchParams(filter as Record<string, string>);
  return sendAsync(`/status?${params.toString()}`, 'GET');
};

const cancelEmailByIdAsync = async (messageId: string) => {
  const response = await getStatusByIdAsync(messageId);
  if (response.status === 'accepted' || response.status === 'pending') {
    await sendAsync(`/cancel/${messageId}`, 'DELETE');
    response.status = 'cancelled';
  }
  return response;
};

const cancelEmailsAsync = async (filter: ChesFilter) => {
  if (filter == null) throw new ErrorWithCode('Null filter.', 400);
  throwIfMissingParameter(filter);
  const params = new URLSearchParams(filter as Record<string, string>);
  return sendAsync(`/cancel?${params}`, 'DELETE');
};

const throwIfMissingParameter = (filter: ChesFilter) => {
  if (!filter.txId && !filter.msgId && !filter.status && !filter.tag)
    throw new ErrorWithCode('At least one parameter expected.', 400);
};

const chesServices = {
  sendEmailAsync,
  getStatusByIdAsync,
  getStatusesAsync,
  cancelEmailByIdAsync,
  cancelEmailsAsync,
};

export default chesServices;
