import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import {
  ILtsaTitleSummaryModel,
  ILtsaTitleSummaryResponse,
} from './interfaces/ILtsaTitleSummaryModel';
import { ILtsaTokens } from '@/services/ltsa/interfaces/ILtsaTokens';
import { ILtsaOrder } from '@/services/ltsa/interfaces/ILtsaOrder';
import getConfig from '@/constants/config';

const ltsaConfig = getConfig().ltsa;
export const processLTSARequest = async (pid: string) => {
  // make a request to get an access token from LTSA
  const ltsatoken = await getTokenAsync();

  // make a request to get title summary info from LTSA
  const titleSummaryResponse: ILtsaTitleSummaryResponse = await getTitleSummary(
    ltsatoken.accessToken,
    pid,
  );
  // Access the first title summary in the list
  const titleSummary: ILtsaTitleSummaryModel = titleSummaryResponse.titleSummaries[0];

  // titleNumber and district code for making order request
  const titleNumber = titleSummary.titleNumber;
  const landTitleDistrictCode = titleSummary.landTitleDistrictCode;

  // make a request to get the LTSA Order
  const order = await createOrderAsync(ltsatoken.accessToken, titleNumber, landTitleDistrictCode);

  return order;
};

export const getTokenAsync: () => Promise<ILtsaTokens> = async () => {
  const cred = {
    integratorUsername: ltsaConfig.integratorUsername,
    integratorPassword: ltsaConfig.integratorPassword,
    myLtsaUserName: ltsaConfig.username,
    myLtsaUserPassword: ltsaConfig.password,
  };
  const response = await fetch(ltsaConfig.authurl, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cred),
    method: 'POST',
  });
  if (!response.ok) {
    throw new ErrorWithCode('Unable to get token from LTSA', response.status);
  } else return await response.json();
};

export const getTitleSummary: (
  accessToken: string,
  pid: string,
) => Promise<ILtsaTitleSummaryResponse> = async (accessToken: string, pid: string) => {
  const url = ltsaConfig.hosturl + 'titleSummaries';
  const queryparams = `filter=parcelIdentifier:${pid}`;
  const requrl = `${url}?${queryparams}`;
  const response = await fetch(requrl, {
    headers: {
      Accept: 'application/vnd.ltsa.astra.titleSummaries+json',
      'X-Authorization': `Bearer ${accessToken}`,
    },
    method: 'GET',
  });
  if (!response.ok) {
    const error: {
      errorMessages?: string[];
    } = JSON.parse(await response.text());
    const message = error.errorMessages?.at(0) ?? `Invalid PID request (${pid})`;
    throw new ErrorWithCode(`(LTSA) ${message}`, response.status);
  } else return await response.json();
};

export const createOrderAsync: (
  accessToken: string,
  titleNumber: string,
  landTitleDistrictCode: string,
) => Promise<ILtsaOrder> = async (
  accessToken: string,
  titleNumber: string,
  landTitleDistrictCode: string,
) => {
  const url = ltsaConfig.hosturl + 'orders';
  const order = {
    order: {
      productType: 'title',
      fileReference: 'Test',
      productOrderParameters: {
        titleNumber: titleNumber,
        landTitleDistrictCode: landTitleDistrictCode,
        includeCancelledInfo: false,
      },
    },
  };
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.ltsa.astra.orders+json',
      'X-Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
    method: 'POST',
  });
  if (!response.ok) {
    throw new ErrorWithCode(
      'Failed to create an order. An error occurred during the HTTP request.',
      response.status,
    );
  } else return await response.json();
};

const ltsaService = {
  processLTSARequest,
  getTokenAsync,
  getTitleSummary,
  createOrderAsync,
};

export default ltsaService;
