import React from 'react';
import renderer from 'react-test-renderer';
import noop from 'lodash/noop';
import { LandForm } from '.';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useKeycloak } from '@react-keycloak/web';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import * as reducerTypes from 'constants/reducerTypes';
import { fireEvent, render, wait } from '@testing-library/react';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const promise = Promise.resolve();

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
      roles: ['admin-properties'],
    },
    subject: 'test',
  },
});

const landForm = (
  <Provider store={store}>
    <Router history={history}>
      <LandForm
        handleGeocoderChanges={() => (promise as unknown) as Promise<void>}
        setMovingPinNameSpace={noop}
        handlePidChange={noop}
        handlePinChange={noop}
      />
    </Router>
  </Provider>
);

describe('Land Form', () => {
  it('component renders correctly', () => {
    const tree = renderer.create(landForm).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays identification page on initial load', () => {
    const { getByText } = render(landForm);
    expect(getByText(/parcel identification/i)).toBeInTheDocument();
  });

  it('goes to corresponding steps', async () => {
    const { getByText, queryByText } = render(landForm);
    await wait(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/usage & zoning/i)).toBeInTheDocument();
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText(/net book value/i)).toBeInTheDocument();
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText(/Review your land info/i)).toBeInTheDocument();
    expect(queryByText(/continue/i)).toBeNull();
  });

  it('review has appropriate subforms', async () => {
    const { getByText } = render(landForm);
    await wait(() => {
      fireEvent.click(getByText(/Review/i));
    });
    expect(getByText(/parcel identification/i)).toBeInTheDocument();
    expect(getByText(/current zoning/i)).toBeInTheDocument();
    expect(getByText(/est'd market value/i)).toBeInTheDocument();
  });
});
