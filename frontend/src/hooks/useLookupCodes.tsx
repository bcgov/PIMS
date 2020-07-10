import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { mapLookupCode } from 'utils';
import _ from 'lodash';

function useCodeLookups() {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const getCodeById = (type: string, id: string): string | undefined => {
    return lookupCodes.filter(code => code.type === type && code.id === id)?.find(x => x)?.code;
  };

  const getByType = (type: string) => lookupCodes.filter(code => code.type === type);

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
  return {
    getOptionsByType: getOptionsByType,
    getCodeById: getCodeById,
    getByType,
    filterByParent,
  };
}

export default useCodeLookups;
