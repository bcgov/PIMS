import { useApiLookups } from 'hooks/api';
import React from 'react';
import { storeLookupCodes, useAppDispatch, useAppSelector } from 'store';
import { mapLookupCode, mapSelectOptionWithParent } from 'utils';

import { useNetwork } from '../network';
import { LookupType } from './constants';

export const useLookups = () => {
  const dispatch = useAppDispatch();
  const network = useNetwork();
  const api = useApiLookups();
  const state = useAppSelector((store) => store.lookupCode);
  const { lookupCodes } = state;

  const controller = {
    fetch: async () => {
      const response = await network.handleRequest('lookups', () => api.fetch());
      if (response) dispatch(storeLookupCodes(response.data));
      return response?.data;
    },
    getType: (type: LookupType, onlyEnabled: boolean = true) =>
      lookupCodes.filter((code) => code.type === type && code.isDisabled !== onlyEnabled),
    getOptions: (type: LookupType, onlyEnabled: boolean = true) =>
      lookupCodes
        .filter((code) => code.type === type && code.isDisabled !== onlyEnabled)
        .map((i) => mapLookupCode(i)),
    getOptionsWithParents: (type: LookupType, onlyEnabled: boolean = true) => {
      const options = lookupCodes
        .filter((code) => code.type === type && code.isDisabled !== onlyEnabled)
        .map((i) => mapLookupCode(i));

      return options.map((i) => mapSelectOptionWithParent(i, options));
    },
  };

  React.useEffect(() => {
    // Initializes lookup values.
    if (lookupCodes.length === 0) {
      controller.fetch();
    }
  }, [lookupCodes]);

  return { state, controller };
};
