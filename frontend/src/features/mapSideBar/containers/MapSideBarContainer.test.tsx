import { useKeycloak } from '@react-keycloak/web';
import { screen } from '@testing-library/dom';
import { fireEvent } from '@testing-library/dom';
import { cleanup, render, waitFor } from '@testing-library/react';
import { IParcel } from 'actions/parcelsActions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actionTypes from 'constants/actionTypes';
import { Claims } from 'constants/claims';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { mockBuildingWithAssociatedLand, mockDetails, mockParcel } from 'mocks/filterDataMock';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import VisibilitySensor from 'react-visibility-sensor';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MapSideBarContainer from './MapSideBarContainer';

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

const history = createMemoryHistory({
  getUserConfirmation: (message, callback) => {
    callback(true);
  },
});

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
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: [1],
          roles: [Claims.PROPERTY_EDIT],
          username: 'test',
        },
        subject: 'test',
      },
    });
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

    xit('Empty parcel sidebar matches snapshot', async () => {
      await act(async () => {
        history.push('/mapview?sidebar=true');
        const { container } = renderContainer({});
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    xit('parcel sidebar snapshot loads by id', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1');
        const { container, findByText } = renderContainer({});
        mockAxios.reset();
        mockAxios.onGet().reply(200, mockDetails[0]);
        await findByText('test name');
        expect(container.firstChild).toMatchSnapshot();
      });
    });

    xit('removes the parcel id when the sidebar is closed', async () => {
      history.push('/mapview/?sidebar=false&parcelId=1');
      renderContainer({
        store: getStore(mockDetails[0]),
      });
      await waitFor(() => expect(history.location.pathname).toEqual('/mapview'));
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
            username: 'test',
          },
          subject: 'test',
        },
      });
      mockAxios.reset();
    });

    xit('edit button displayed in view mode if user belongs to same agency as property', async () => {
      history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
      mockAxios.onGet().reply(200, mockDetails[0]);
      const { findByTestId } = renderContainer({});

      const editButton = await findByTestId('edit');
      await waitFor(() => expect(editButton).toBeInTheDocument());
    });

    xit('edit button not displayed if user does not belong to same agency as property', async () => {
      await act(() => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], agencyId: 2 };
        mockAxios.onGet().reply(200, parcel);
        const { queryByTestId } = renderContainer({});

        const editButton = queryByTestId('edit');
        expect(editButton).not.toBeInTheDocument();
      });
    });

    xit('edit button not displayed if property in SPP project', async () => {
      await act(() => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], projectNumbers: ['SPP-10000'] };
        mockAxios.onGet().reply(200, parcel);
        const { queryByTestId } = renderContainer({});

        const editButton = queryByTestId('edit');
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
            username: 'test',
          },
          subject: 'test',
        },
      });
    });

    xit('edit button displayed in view mode if admin belongs to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        mockAxios.onGet().reply(200, mockDetails[0]);
        const { findByTestId } = renderContainer({});

        const editButton = await findByTestId('edit');
        expect(editButton).toBeInTheDocument();
      });
    });

    xit('edit button displayed if admin does not belong to same agency as property', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&parcelId=1&disabled=true');
        const parcel = { ...mockDetails[0], agencyId: 2 };
        mockAxios.onGet().reply(200, parcel);
        const { findByTestId } = renderContainer({});

        const editButton = await findByTestId('edit');
        expect(editButton).toBeInTheDocument();
      });
    });

    xit('edit button displayed if property in SPP project and user is admin', async () => {
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
    xit('saves the building when clicked', async () => {
      history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
      const building = { ...mockBuildingWithAssociatedLand, parcels: [] };
      mockAxios.onGet().reply(200, building);
      const { findByText } = renderContainer({});

      mockAxios.onPut().reply(200, building);

      const reviewButton = await findByText('Review & Submit');
      fireEvent.click(reviewButton);
      const modifyButton = await findByText('Modify Associated Land');
      fireEvent.click(modifyButton);
      await waitFor(() => expect(mockAxios.history.put.length).toBe(1));

      const associatedLandText = await screen.findByText('Review associated land information');
      await waitFor(() => expect(associatedLandText).toBeVisible());
    });
    xit('displays an error toast if the save action fails', async () => {
      await act(async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = { ...mockBuildingWithAssociatedLand, parcels: [] };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().reply(500, null);

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);
        const modifyButton = await findByText('Modify Associated Land');
        fireEvent.click(modifyButton);
        const failedBuildingSaveToast = await screen.findByText('Failed to update Building.');
        expect(failedBuildingSaveToast).toBeVisible();
      });
    });
    xit('uses the most recent data from the api response', async () => {
      history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
      const building = {
        ...mockBuildingWithAssociatedLand,
        name: 'Modify assoc. land 12345',
        parcels: [],
      };
      mockAxios.onGet().reply(200, building);
      const { findByText } = renderContainer({});

      mockAxios.onPut().reply(200, building);

      const reviewButton = await findByText('Review & Submit');
      fireEvent.click(reviewButton);
      const modifyButton = await findByText('Modify Associated Land');
      fireEvent.click(modifyButton);
      await waitFor(() => expect(mockAxios.history.put.length).toBe(1));

      const associatedLandText = await screen.findByText('Modify assoc. land 12345');
      await waitFor(() => expect(associatedLandText).toBeVisible());
    });
    describe('add tab functionality', () => {
      xit('adds tabs', async () => {
        await act(async () => {
          history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
          const building = {
            ...mockBuildingWithAssociatedLand,
            name: 'Modify assoc. land 12345',
            parcels: [{ ...mockParcel, classificationId: '' }],
          };
          mockAxios.onGet().reply(200, building);
          const { findByText } = renderContainer({});

          mockAxios.onPut().replyOnce(200, { ...building });
          mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

          const reviewButton = await findByText('Review & Submit');
          fireEvent.click(reviewButton);
          const modifyButton = await findByText('Modify Associated Land');
          fireEvent.click(modifyButton);
          const associatedLandText = await screen.findByText('Modify assoc. land 12345');
          expect(associatedLandText).toBeVisible();
        });

        await act(async () => {
          const addTabButton = await screen.findByTestId('add-tab');
          fireEvent.click(addTabButton);
          const oldDeleteIcon = screen.queryByTestId('delete-parcel-2');
          expect(oldDeleteIcon).toBeInTheDocument();
        });
      });
      xit('allows tabs to be clicked', async () => {
        await act(async () => {
          history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
          const building = {
            ...mockBuildingWithAssociatedLand,
            name: 'Modify assoc. land 12345',
            parcels: [mockParcel, { ...mockParcel, name: 'test 2' }],
          };
          mockAxios.onGet().reply(200, building);
          const { findByText } = renderContainer({});

          mockAxios.onPut().replyOnce(200, { ...building });
          mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

          const reviewButton = await findByText('Review & Submit');
          fireEvent.click(reviewButton);
          const modifyButton = await findByText('Modify Associated Land');
          fireEvent.click(modifyButton);
          const associatedLandText = await screen.findByText('Modify assoc. land 12345');
          expect(associatedLandText).toBeVisible();
        });

        await act(async () => {
          const addTabButton = (await screen.findAllByText('test 2'))[0];
          fireEvent.click(addTabButton);
          const activeTabButton = (await screen.findAllByText('test 2'))[0];
          expect(activeTabButton.parentElement).toHaveClass('active');
        });
      });

      xit('displays a tab for each parcel', async () => {
        await act(async () => {
          history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
          const building = {
            ...mockBuildingWithAssociatedLand,
            name: 'Modify assoc. land 12345',
            parcels: [mockParcel, mockParcel],
          };
          mockAxios.onGet().reply(200, building);
          const { findByText } = renderContainer({});

          mockAxios.onPut().replyOnce(200, { ...building });
          mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

          const reviewButton = await findByText('Review & Submit');
          fireEvent.click(reviewButton);
          const modifyButton = await findByText('Modify Associated Land');
          fireEvent.click(modifyButton);
          const associatedLandText = await screen.findByText('Modify assoc. land 12345');
          expect(associatedLandText).toBeVisible();
        });

        await act(async () => {
          const addTabButtons = await screen.findAllByText('test name');
          //2 of these will be the tab headers, the other two are the tabs.
          expect(addTabButtons).toHaveLength(4);
        });
      });
    });
    describe('tab delete functionality', () => {
      beforeEach(() => {
        mockAxios.resetHistory();
        mockAxios.reset();
        jest.resetAllMocks();
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            userInfo: {
              agencies: [1],
              roles: [Claims.PROPERTY_EDIT],
              username: 'test',
            },
            subject: 'test',
          },
        });
      });
      xit('allows tabs to be deleted', async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = {
          ...mockBuildingWithAssociatedLand,
          name: 'Modify assoc. land 12345',
          parcels: [mockParcel],
        };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().replyOnce(200, building);
        mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);
        const modifyButton = await findByText('Modify Associated Land');
        fireEvent.click(modifyButton);
        const associatedLandText = await screen.findByText('Modify assoc. land 12345');
        await waitFor(() => {
          expect(associatedLandText).toBeVisible();
        });
        const deleteIcon = await screen.findByTestId('delete-parcel-1');
        fireEvent.click(deleteIcon);
        const removeText = await screen.findByText('Really Remove Associated Parcel?');
        await waitFor(() => {
          expect(removeText).toBeVisible();
        });
        const okButton = await screen.findByText('Ok');
        fireEvent.click(okButton);
        const oldDeleteIcon = await screen.findByTestId('delete-parcel-1');
        await waitFor(() => {
          expect(oldDeleteIcon).not.toBeInTheDocument();
        });
      }, 10000);
      xit('does not delete buildings if there are errors', async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = {
          ...mockBuildingWithAssociatedLand,
          name: 'Modify assoc. land 12345',
          parcels: [{ ...mockParcel, classificationId: '' }],
        };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().replyOnce(200, { ...building });
        mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);
        const modifyButton = await findByText('Modify Associated Land');
        fireEvent.click(modifyButton);
        const associatedLandText = await screen.findByText('Modify assoc. land 12345');
        await waitFor(() => {
          expect(associatedLandText).toBeVisible();
        });
        const deleteIcon = await screen.findByTestId('delete-parcel-1');
        fireEvent.click(deleteIcon);
        const removeText = await screen.findByText('Really Remove Associated Parcel?');
        await waitFor(() => {
          expect(removeText).toBeVisible();
        });
        const okButton = await screen.findByText('Ok');
        fireEvent.click(okButton);
        const oldDeleteIcon = await screen.findByTestId('delete-parcel-1');
        await waitFor(() => {
          expect(oldDeleteIcon).toBeInTheDocument();
        });
      }, 10000);
      xit('does not delete tabs if there are errors', async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = {
          ...mockBuildingWithAssociatedLand,
          name: 'Modify assoc. land 12345',
          parcels: [{ ...mockParcel, classificationId: '' }],
        };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().replyOnce(200, { ...building });
        mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);
        const modifyButton = await findByText('Modify Associated Land');
        fireEvent.click(modifyButton);
        const associatedLandText = await screen.findByText('Modify assoc. land 12345');
        await waitFor(() => {
          expect(associatedLandText).toBeVisible();
        });
        const deleteIcon = await screen.findByTestId('delete-parcel-1');
        fireEvent.click(deleteIcon);
        const removeText = await screen.findByText('Really Remove Associated Parcel?');
        await waitFor(() => {
          expect(removeText).toBeVisible();
        });
        const okButton = await screen.findByText('Ok');
        fireEvent.click(okButton);
        const oldDeleteIcon = screen.queryByTestId('delete-parcel-1');
        await waitFor(() => {
          expect(oldDeleteIcon).toBeInTheDocument();
        });
      }, 10000);
      xit('deletes tabs if there is no leasedlandmetadata', async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = {
          ...mockBuildingWithAssociatedLand,
          name: 'Modify assoc. land 12345',
          parcels: [{ ...mockParcel }],
        };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().replyOnce(200, { ...building, leasedLandMetadata: [] });
        mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);
        await waitFor(async () => {
          const modifyButton = await findByText('Modify Associated Land');
          fireEvent.click(modifyButton);
          await waitFor(async () => {
            const associatedLandText = await screen.findByText('Modify assoc. land 12345');
            expect(associatedLandText).toBeVisible();
          });

          const deleteIcon = await screen.findByTestId('delete-parcel-1');
          fireEvent.click(deleteIcon);

          await waitFor(async () => {
            const removeText = await screen.findByText('Really Remove Associated Parcel?');
            expect(removeText).toBeVisible();
          });

          const okButton = await screen.findByText('Ok');
          fireEvent.click(okButton);

          await waitFor(() => {
            const oldDeleteIcon = screen.queryByTestId('delete-parcel-1');
            expect(oldDeleteIcon).not.toBeInTheDocument();
          });
        });
      }, 10000);
      xit('deletes tabs if there are multiple tabs and no leasedlandmetadata', async () => {
        history.push('/mapview/?sidebar=true&buildingId=1&disabled=false');
        const building = {
          ...mockBuildingWithAssociatedLand,
          name: 'Modify assoc. land 12345',
          parcels: [mockParcel, mockParcel],
        };
        mockAxios.onGet().reply(200, building);
        const { findByText } = renderContainer({});

        mockAxios.onPut().replyOnce(200, { ...building, leasedLandMetadata: [] });
        mockAxios.onPut().replyOnce(200, { ...building, parcels: [], leasedLandMetadata: [] });

        const reviewButton = await findByText('Review & Submit');
        fireEvent.click(reviewButton);

        await waitFor(async () => {
          const modifyButton = await findByText('Modify Associated Land');
          fireEvent.click(modifyButton);

          await waitFor(async () => {
            const associatedLandText = await screen.findByText('Modify assoc. land 12345');
            expect(associatedLandText).toBeVisible();
          });

          const deleteIcon = await screen.findByTestId('delete-parcel-1');
          fireEvent.click(deleteIcon);

          await waitFor(async () => {
            const removeText = await screen.findByText('Really Remove Associated Parcel?');
            expect(removeText).toBeVisible();
          });

          const okButton = await screen.findByText('Ok');
          fireEvent.click(okButton);

          await waitFor(() => {
            const oldDeleteIcon = screen.queryByTestId('delete-parcel-2');
            expect(oldDeleteIcon).not.toBeInTheDocument();
          });
        });
      }, 10000);
    });
  });
});
