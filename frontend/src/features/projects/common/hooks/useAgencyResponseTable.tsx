import { ILookupCode } from 'actions/ILookupCode';
import { AgencyResponses } from 'features/projects/constants';
import { IProjectAgencyResponse } from 'features/projects/interfaces';
import useCodeLookups from 'hooks/useLookupCodes';
import _ from 'lodash';
import { useMemo } from 'react';

import { useProject } from '..';

/** get a list of generated and existing agencies project agency responses. */
export const generateAgencyResponseRows = (
  agencies: ILookupCode[],
  projectAgencyResponses: IProjectAgencyResponse[],
  projectId?: number,
) => {
  if (projectId === undefined) {
    return [];
  }
  const responses = _.cloneDeep(projectAgencyResponses);
  agencies.forEach((agency) => {
    if (!_.find(projectAgencyResponses, { agencyId: agency.id })) {
      responses.push({
        agencyId: parseInt(agency.id, 10),
        agencyCode: agency.name,
        response: AgencyResponses.Unsubscribe,
        projectId: projectId,
        offerAmount: 0,
      });
    }
  });
  return _.sortBy(responses, 'agencyCode');
};

const useAgencyResponseTable = () => {
  const agencies = useCodeLookups().getByType('Agency');
  const { project } = useProject();
  const projectAgencyResponses = useMemo(
    () => generateAgencyResponseRows(agencies, project.projectAgencyResponses, project.id),
    [agencies, project.id, project.projectAgencyResponses],
  );

  return {
    projectAgencyResponses: projectAgencyResponses,
  };
};

export default useAgencyResponseTable;
