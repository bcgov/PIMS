import Adapter from '@cfaester/enzyme-adapter-react-18';
import { cleanup, render } from '@testing-library/react';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import Enzyme from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import useKeycloakWrapper from './useKeycloakWrapper';
import { useMyAgencies } from './useMyAgencies';

const userRoles: string[] | Claims[] = [Claims.PROJECT_VIEW, Claims.ADMIN_PROJECTS];
const userAgencies: number[] = [1, 8, 41];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: {
    lookupCodes: [
      { type: 'Agency', code: 'BCA', parentId: 8, id: 41, name: 'BC Assessment' },
      { type: 'Agency', code: 'BAC', id: 8, name: 'B Assessment C' },
      { type: 'Agency', code: 'ABC', id: 1, name: 'Assessment BC' },
    ],
  },
  usersAgencies: [
    { id: '1', name: 'Assessment BC' },
    { id: '8', name: 'B Assessment C' },
    { id: '41', name: 'BC Assessment' },
  ],
});

const MyAgencies = () => {
  const agencies = useMyAgencies();

  return (
    <>
      {agencies.map((agency) => (
        <h6 key={agency.value} data-testid={`agency-${agency.value}`}>
          {agency.label}
        </h6>
      ))}
    </>
  );
};

describe('UseMyAgencies', () => {
  afterEach(() => {
    cleanup();
  });

  it('Is SRES user, should return all agencies', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <MyAgencies />
      </Provider>,
    );

    expect(getByTestId('agency-1')).toBeDefined();
    expect(getByTestId('agency-8')).toBeDefined();
    expect(getByTestId('agency-41')).toBeDefined();
  });

  it('Belongs to Sub Agency, should return one agencies', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, [41], 41),
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <MyAgencies />
      </Provider>,
    );

    expect(getByTestId('agency-41')).toBeDefined();
  });

  it('Belongs to Parent Agency, should return parent agency and child agency', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, [8], 8),
    );

    const { getByTestId } = render(
      <Provider store={store}>
        <MyAgencies />
      </Provider>,
    );

    expect(getByTestId('agency-8')).toBeDefined();
    expect(getByTestId('agency-41')).toBeDefined();
  });
});
