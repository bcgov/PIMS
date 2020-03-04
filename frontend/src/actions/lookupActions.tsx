import * as ActionTypes from 'constants/actionTypes';

//Parcel List API action

export interface ILookupCode {
  name: string;
  id: number;
  isDisabled: boolean;
  type: string;
}

export interface IStoreLookupCodeAction {
  type: typeof ActionTypes.STORE_LOOKUP_CODE_RESULTS;
  lookupCodes: ILookupCode[];
}

export const storeLookupCodesAction = (lookupCodes: ILookupCode[]) => ({
  type: ActionTypes.STORE_LOOKUP_CODE_RESULTS,
  lookupCodes: lookupCodes,
});
