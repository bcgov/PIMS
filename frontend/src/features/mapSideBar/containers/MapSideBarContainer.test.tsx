import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup, wait } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { act } from 'react-dom/test-utils';
import { ToastContainer } from 'react-toastify';
import MapSideBarContainer from './MapSideBarContainer';
import { noop } from 'lodash';
import * as reducerTypes from 'constants/reducerTypes';
import * as actionTypes from 'constants/actionTypes';
import { IParcel } from 'actions/parcelsActions';
import { mockDetails } from 'mocks/filterDataMock';
import VisibilitySensor from 'react-visibility-sensor';
import { useKeycloak } from '@react-keycloak/web';

jest.mock(
  'react-visibility-sensor',
  (): typeof VisibilitySensor => ({ children, partialVisibility, ...rest }: any) => (
    <div {...rest}>{typeof children === 'function' ? children({ isVisible: true }) : children}</div>
  ),
);

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

const mockStore = configureMockStore([thunk]);
const getStore = (parcelDetail?: IParcel) =>
  mockStore({
    [reducerTypes.NETWORK]: {
      [actionTypes.GET_PARCEL_DETAIL]: {
        status: 200,
      },
    },
    [reducerTypes.PARCEL]: {
      parcelDetail: {
        parcelDetail: parcelDetail,
        propertyTypeId: 0,
      },
      parcels: [],
      draftParcels: [],
    },
    [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
    [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
  });

const history = createMemoryHistory();

const renderContainer = ({ store }: any) =>
  render(
    <Provider store={store ?? getStore()}>
      <Router history={history}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <Route path="/mapView/:id?">
          <MapSideBarContainer refreshParcels={noop} properties={[]} />
        </Route>
      </Router>
    </Provider>,
  );

describe('Parcel Detail MapSideBarContainer', () => {
  // clear mocks before each test
  beforeEach(() => {});
  afterEach(() => {
    history.push({ search: '' });
    cleanup();
  });

  describe('basic data loading and display', () => {
    it('sidebar is hidden', async () => {
      await act(async () => {
        const { container } = renderContainer({});
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    it('Empty parcel sidebar matches snapshot', async () => {
      await act(async () => {
        history.push('/mapview?sidebar=true');
        const { container } = renderContainer({});
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    xit('parcel sidebar snapshot loads by id', async () => {
      await act(async () => {
        history.push('/mapview/1?sidebar=true');
        const { container, findByDisplayValue } = renderContainer({
          store: getStore(mockDetails[0]),
        });
        await findByDisplayValue('000-000-000');
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    it('removes the parcel id when the sidebar is closed', () => {
      history.push('/mapview/1?sidebar=false');
      renderContainer({
        store: getStore(mockDetails[0]),
      });
      wait(() => expect(history.location.pathname).toEqual('/mapview'));
    });

    it('removes the parcel id when the sidebar is closed', () => {
      history.push('/mapview/1?sidebar=false');
      renderContainer({
        store: getStore(mockDetails[0]),
      });
      wait(() => expect(history.location.pathname).toEqual('/mapview'));
    });
  });
});
