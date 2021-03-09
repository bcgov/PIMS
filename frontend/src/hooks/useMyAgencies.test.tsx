import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import Claims from 'constants/claims';
import { useMyAgencies } from './useMyAgencies';

jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: {
    lookupCodes: [
      { type: 'Agency', code: 'BCA', parentId: 8, id: 41, name: 'BC Assessment' },
      { type: 'Agency', code: 'BAC', id: 8, name: 'B Assessment C' },
      { type: 'Agency', code: 'ABC', id: 1, name: ' Assessment BC' },
    ],
  },
});

const MyAgencies = () => {
  const agencies = useMyAgencies();

  return (
    <>
      {agencies.map(agency => (
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
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['1'],
          roles: [Claims.PROJECT_VIEW, Claims.ADMIN_PROJECTS],
        },
        subject: 'test',
      },
    });

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
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['41'],
          roles: [],
        },
        subject: 'test',
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <MyAgencies />
      </Provider>,
    );

    expect(getByTestId('agency-41')).toBeDefined();
  });

  it('Belongs to Parent Agency, should return parent agency and child agency', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['8'],
          roles: [],
        },
        subject: 'test',
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <MyAgencies />
      </Provider>,
    );

    expect(getByTestId('agency-8')).toBeDefined();
    expect(getByTestId('agency-41')).toBeDefined();
  });
});
