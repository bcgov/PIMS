import { useKeycloak } from '@react-keycloak/web';
import { SYSTEM_ADMINISTRATOR, AGENCY_ADMINISTRATOR } from 'constants/strings';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';

function useCodeLookups() {
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const getCodeById = (type: string, id: string): string | undefined => {
    return lookupCodes.filter(code => code.type === type && code.id == id)?.find(x => x)?.code;
  };
  return {
    getCodeById: getCodeById,
  };
}

export default useCodeLookups;
