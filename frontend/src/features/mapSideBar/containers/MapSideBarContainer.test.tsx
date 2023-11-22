import { cleanup, render } from '@testing-library/react';
import { IParcel } from 'actions/parcelsActions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actionTypes from 'constants/actionTypes';
import { Claims } from 'constants/claims';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import VisibilitySensor from 'react-visibility-sensor';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import MapSideBarContainer from './MapSideBarContainer';

jest.mock(
  'react-visibility-sensor',
  (): typeof VisibilitySensor =>
    ({ children, ...rest }: any) => (
      <div {...rest}>
        {typeof children === 'function' ? children({ isVisible: true }) : children}
      </div>
    ),
);
const mockAxios = new MockAdapter(axios);

jest.mock('hooks/useKeycloakWrapper');

const mockStore = configureMockStore([thunk]);
const getStore = (parcelDetail?: IParcel) =>
  mockStore({
    network: {
      [actionTypes.GET_PARCEL_DETAIL]: {
        status: 200,
      },
    },
    parcel: {
      propertyDetail: {
        parcelDetail: parcelDetail,
        propertyTypeId: 0,
      },
      properties: [],
      draftProperties: [],
    },
    lookupCode: { lookupCodes: [] },
  });

const history = createMemoryHistory();

const renderContainer = ({ store }: any) =>
  render(
    <Provider store={store ?? getStore()}>
      <MemoryRouter initialEntries={['/']}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <Routes>
          <Route path="/" element={<MapSideBarContainer properties={[]} />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

describe('Parcel Detail MapSideBarContainer', () => {
  // clear mocks before each test
  beforeEach(() => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)([Claims.PROPERTY_EDIT], [1], 1),
    );
    mockAxios.onAny().reply(200, {});
  });
  afterEach(() => {
    history.push({ search: '' });
    jest.resetAllMocks();
    cleanup();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('basic data loading and display', () => {
    it('sidebar is hidden', async () => {
      await act(async () => {
        const { container } = renderContainer({});
        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });
});
