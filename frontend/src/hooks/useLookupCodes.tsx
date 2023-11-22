import { ILookupCode } from 'actions/ILookupCode';
import { SelectOption } from 'components/common/form';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { Classifications } from 'constants/classifications';
import _ from 'lodash';
import { useCallback } from 'react';
import { useAppSelector } from 'store';
import { mapLookupCode } from 'utils';

import { useKeycloakWrapper } from './useKeycloakWrapper';

/**
 * Hook to return an array ILookupCode for specific types.
 */
export function useCodeLookups() {
  const keycloak = useKeycloakWrapper();
  const lookupCodes = useAppSelector<ILookupCode[]>((store) => store.lookupCode.lookupCodes);
  const getCodeById = (type: string, id: string): string | undefined => {
    return lookupCodes.filter((code) => code.type === type && code.id === id)?.find((x) => x)?.code;
  };

  const getByType = useCallback(
    (type: string) => lookupCodes.filter((code) => code.type === type && code.isDisabled !== true),
    [lookupCodes],
  );

  const getPublicByType = useCallback(
    (type: string) =>
      lookupCodes.filter(
        (code) => code.type === type && code.isDisabled === false && code.isPublic !== false,
      ),
    [lookupCodes],
  );

  /**
   * filter the passed list of agencies. If the passed agency is a parent agency, include all child agencies. Otherwise just return the filter agency.
   * @param codes
   * @param lookupCodeId
   */
  const filterByParent = (codes: ILookupCode[], lookupCodeId: number): ILookupCode[] => {
    const filterByCode = _.find(codes, { id: lookupCodeId }) as ILookupCode;
    if (filterByCode?.parentId !== undefined) {
      return [filterByCode];
    }
    if (filterByCode === undefined) {
      return [];
    }
    const filteredAgencies = _.filter(codes, { parentId: filterByCode?.id });
    filteredAgencies.unshift(filterByCode);
    return filteredAgencies as ILookupCode[];
  };

  const getOptionsByType = (type: string) => getByType(type).map(mapLookupCode);

  /**
   * Return an array of SelectOptions containing property classifications.
   * @param filter - A filter to determine which classifications will be returned.
   * @returns An array of SelectOptions for property classifications.
   */
  const getPropertyClassificationOptions = (
    filter?: (value: SelectOption, index: number, array: SelectOption[]) => unknown,
  ) => {
    const classifications = getByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
    return filter
      ? (classifications ?? []).map((c) => mapLookupCode(c)).filter(filter)
      : !keycloak.hasClaim(Claims.ADMIN_PROPERTIES)
        ? (classifications ?? [])
            .map((c) => mapLookupCode(c))
            .filter(
              (c) =>
                +c.value !== Classifications.Subdivided && +c.value !== Classifications.Disposed,
            )
        : (classifications ?? []).map((c) => mapLookupCode(c));
  };

  /**
   * Returns the full name of an agency or the short code if
   * the full name is not found
   * @param agencyId the id for the agency
   */
  const getAgencyFullNameById = (agencyId?: number) => {
    const agencies = getByType(API.AGENCY_CODE_SET_NAME);
    const agencyItem = agencies.find((listItem) => Number(listItem.id) === agencyId);
    return agencyItem ? agencyItem.name : agencyId;
  };

  /**
   * Returns the full name of a classification
   * @param classficationId the id for the classification
   */
  const getClassificationNameById = (classficationId?: number) => {
    const classfications = getByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
    const classification = classfications.find(
      (listItem) => Number(listItem.id) === classficationId,
    );
    return classification ? classification.name : '';
  };

  return {
    getOptionsByType,
    getPropertyClassificationOptions,
    getCodeById,
    getByType,
    getPublicByType,
    filterByParent,
    getAgencyFullNameById,
    getClassificationNameById,
    lookupCodes,
  };
}

export default useCodeLookups;
