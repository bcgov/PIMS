import config from '@/constants/config';
import urls from '@/constants/urls';
import { ChesFilter } from '@/controllers/tools/toolsSchema';
import { PimsRequestUser } from '@/middleware/userAuthCheck';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { decodeJWT } from '@/utilities/decodeJWT';
import logger from '@/utilities/winstonLogger';

let _token: TokenResponse = null;

interface TokenResponse {
  access_token?: string;
}

interface KeycloakPayload {
  exp: number;
}

/**
 * Reads and decodes the header and payload from the provided token response.
 * @param token - The token response containing an access token.
 * @returns An object with the decoded header and payload information.
 */
const readToken = (token: TokenResponse) => {
  const [header, payload] = token.access_token.split('.');
  const info = {
    header: decodeJWT(header),
    payload: decodeJWT(payload) as KeycloakPayload,
  };
  return info;
};

/**
 * Retrieves a token asynchronously using the provided username and password.
 * @param username - The username for authentication.
 * @param password - The password for authentication.
 * @returns A Promise that resolves to a TokenResponse object containing an access token.
 */
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

/**
 * Asynchronously refreshes the token if it is expired or not available.
 */
const refreshTokenAsync = async () => {
  if (!_token?.access_token || new Date(readToken(_token).payload.exp) <= new Date()) {
    const cfg = config();
    _token = await getTokenAsync(cfg.ches.username, cfg.ches.password);
  }
};

/**
 * Sends a request to the specified endpoint with the provided method and data.
 * Automatically refreshes the access token if needed.
 * @param endpoint The endpoint to send the request to.
 * @param method The HTTP method to use for the request (e.g., 'GET', 'POST').
 * @param data The data to be sent with the request (default is null).
 * @returns A promise that resolves to the response data from the endpoint.
 */
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

  if (!response.ok) {
    logger.error({
      message: 'CHES Error',
      chesResponse: JSON.parse(await response.text()),
    });
    return null;
  }

  const text = await response.text();
  if (text.length) {
    return JSON.parse(text);
  } else {
    return null;
  }
};

/* The following enums and interfaces are defined by the CHES service. */
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

/**
 * Asynchronously sends an email using the provided email details and user information.
 * If the email is null, an error with code 400 is thrown.
 * Handles configurations for email sending, including setting 'from', 'bcc', 'cc', 'delayTS', 'to', based on the organization's settings.
 * Returns the response of sending the email if email sending is enabled, otherwise returns null.
 * @param email - The email details to be sent.
 * @param user - The SSO user information.
 * @returns A promise that resolves to the response of sending the email or null.
 */
const sendEmailAsync = async (
  email: IEmail,
  user: PimsRequestUser,
): Promise<IEmailSentResponse | null> => {
  const cfg = config();
  if (email == null) {
    throw new ErrorWithCode('Null argument for email.', 400);
  }

  email.from = email.from ?? cfg.ches.defaultFrom;

  if (cfg.ches.bccCurrentUser) {
    email.bcc = [user.Email, ...(email.bcc ?? [])];
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
      : [user.Email];
    email.cc = email.cc?.length ? [user.Email] : [];
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

/**
 * Asynchronously retrieves the status of a message by its ID from the CHES service.
 * @param messageId - The unique identifier of the message to fetch the status for.
 * @returns A Promise that resolves to an object containing the status details:
 *          - status: The status of the message.
 *          - tag: The tag associated with the message.
 *          - txId: The transaction ID of the message.
 *          - updatedTS: The timestamp when the status was last updated.
 *          - createdTS: The timestamp when the message was created.
 *          Returns null if an error occurs during the retrieval process.
 */
const getStatusByIdAsync = async (messageId: string): Promise<IChesStatusResponse> => {
  try {
    const response: IChesStatusResponse = await sendAsync(`/status/${messageId}`, 'GET');
    if (!response) {
      throw new Error(`Failed to fetch status for messageId ${messageId}`);
    }
    return response;
  } catch (error) {
    logger.error(`Error fetching status for messageId ${messageId}:`, error);
    return null;
  }
};

/**
 * Retrieves statuses asynchronously based on the provided filter.
 * Throws an error if the filter is null or if any required parameter is missing.
 * Constructs URL parameters from the filter and sends a GET request to fetch statuses.
 * @param filter - The filter object containing parameters for status retrieval.
 * @returns A promise that resolves with the fetched statuses.
 * @throws {ErrorWithCode} When the filter is null or missing required parameters.
 */
const getStatusesAsync = async (filter: ChesFilter) => {
  if (filter == null) throw new ErrorWithCode('Null filter.', 400);
  throwIfMissingParameter(filter);
  const params = new URLSearchParams(filter as Record<string, string>);
  return sendAsync(`/status?${params.toString()}`, 'GET');
};

/**
 * Asynchronously cancels an email message by its ID.
 * Retrieves the status of the message using the 'getStatusByIdAsync' function.
 * If the status is 'accepted' or 'pending', sends a cancellation request using 'sendAsync' with a 'DELETE' method.
 * Updates the status of the message to 'cancelled' if the cancellation is successful.
 * Returns the updated response object containing the message status.
 */
const cancelEmailByIdAsync = async (messageId: string) => {
  const response = await getStatusByIdAsync(messageId);
  if (response.status === 'accepted' || response.status === 'pending') {
    await sendAsync(`/cancel/${messageId}`, 'DELETE');
    response.status = 'cancelled';
  }
  return response;
};

/**
 * Asynchronously cancels emails based on the provided filter.
 * Throws an error with code 400 if the filter is null.
 * Throws an error if at least one parameter is missing in the filter.
 * Converts the filter into URL parameters and sends a DELETE request to cancel emails.
 * @param filter - The filter object containing criteria for canceling emails.
 * @returns A promise that resolves with the result of canceling emails.
 */
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
