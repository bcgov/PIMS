import Claims from 'constants/claims';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import noop from 'lodash/noop';
import React from 'react';
import renderer from 'react-test-renderer';
import useKeycloakMock from 'useKeycloakWrapperMock';

import SubmitPropertySelector from './SubmitPropertySelector';

const userRoles: string[] | Claims[] = ['admin-properties'];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

describe('SubmitPropertySelector', () => {
  it('component renders correctly', () => {
    const tree = renderer
      .create(
        <SubmitPropertySelector addSubdivision={noop} addBuilding={noop} addBareLand={noop} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
