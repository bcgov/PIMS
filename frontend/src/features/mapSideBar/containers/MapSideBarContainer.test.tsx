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
import { mockDetails, mockBuildingWithAssociatedLand } from 'mocks/filterDataMock';
import VisibilitySensor from 'react-visibility-sensor';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Claims } from 'constants/claims';
import { screen } from '@testing-library/dom';

jest.mock(
  'react-visibility-sensor',
  (): typeof VisibilitySensor => ({ children, partialVisibility, ...rest }: any) => (
    <div {...rest}>{typeof children === 'function' ? children({ isVisible: true }) : children}</div>
  ),
);
const mockAxios = new MockAdapter(axios);

jest.mock('@react-keycloak/web');

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
  beforeEach(() => {
    jest.resetAllMocks();
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: [1],
          roles: [Claims.PROPERTY_EDIT],
        },
        subject: 'test',
      },
    });
    mockAxios.onAny().reply(200, {});
  });
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

    it('parcel sidebar snapshot loads by id', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1');
        const { container, findByDisplayValue } = renderContainer({});
        mockAxios.reset();
        mockAxios.onGet().reply(200, mockDetails[0]);
        await findByDisplayValue('000-000-000');
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    it('removes the parcel id when the sidebar is closed', () => {
      history.push('/mapview/?sidebar=false&parcelId=1');
      renderContainer({
        store: getStore(mockDetails[0]),
      });
      wait(() => expect(history.location.pathname).toEqual('/mapview'));
    });
  });
  describe('edit button display as rem', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          userInfo: {
            agencies: [1],
            roles: [Claims.PROPERTY_EDIT],
          },
          subject: 'test',
        },
      });
      mockAxios.reset();
    });

    it('edit button displayed in view mode if user belongs to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        mockAxios.onGet().reply(200, mockDetails[0]);
        const { findByTestId } = renderContainer({});

        await wait(async () => {
          const editButton = await findByTestId('edit');
          expect(editButton).toBeInTheDocument();
        });
      });
    });

    it('edit button not displayed if user does not belong to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], agencyId: 2 };
        mockAxios.onGet().reply(200, parcel);
        const { queryByTestId } = renderContainer({});

        const editButton = await queryByTestId('edit');
        expect(editButton).not.toBeInTheDocument();
      });
    });

    it('edit button not displayed if property in SPP project', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], projectNumbers: ['SPP-10000'] };
        mockAxios.onGet().reply(200, parcel);
        const { queryByTestId } = renderContainer({});

        const editButton = await queryByTestId('edit');
        expect(editButton).not.toBeInTheDocument();
      });
    });
  });
  describe('edit button display as admin', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          userInfo: {
            agencies: [1],
            roles: [Claims.ADMIN_PROPERTIES],
          },
          subject: 'test',
        },
      });
    });

    it('edit button displayed in view mode if admin belongs to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        mockAxios.onGet().reply(200, mockDetails[0]);
        const { findByTestId } = renderContainer({});

        const editButton = await findByTestId('edit');
        expect(editButton).toBeInTheDocument();
      });
    });

    it('edit button displayed if admin does not belong to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], agencyId: 2 };
        mockAxios.onGet().reply(200, parcel);
        const { findByTestId } = renderContainer({});

        const editButton = await findByTestId('edit');
        expect(editButton).toBeInTheDocument();
      });
    });

    it('edit button displayed if property in SPP project and user is admin', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], projectNumbers: ['SPP-10000'] };
        mockAxios.onGet().reply(200, parcel);
        const { findByTestId } = renderContainer({});

        const editButton = await findByTestId('edit');
        expect(editButton).toBeInTheDocument();
      });
    });
  });
  describe('modify associated land functionality', () => {
    beforeEach(() => {
      mockAxios.resetHistory();
      mockAxios.reset();
    });
    it('saves the building when clicked', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = { ...mockBuildingWithAssociatedLand };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().reply(200, null);

        const reviewButton = await findByText('Review & Submit');
        reviewButton.click();
        const modifyButton = await findByText('Modify Associated Land');
        modifyButton.click();
        await wait(async () => {
          expect(mockAxios.history.put.length).toBe(1);
          const associatedLandText = await screen.findByText('Review associated land information');
          expect(associatedLandText).toBeVisible();
        });
      });
    });
    it('displays an error toast if the save action fails', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = { ...mockBuildingWithAssociatedLand };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().reply(500, null);

        const reviewButton = await findByText('Review & Submit');
        reviewButton.click();
        const modifyButton = await findByText('Modify Associated Land');
        modifyButton.click();
        const failedBuildingSaveToast = await screen.findByText('Failed to update Building.');
        expect(failedBuildingSaveToast).toBeVisible();
      });
    });
  });
});
