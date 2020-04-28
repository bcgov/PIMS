import React from 'react';
import { createMemoryHistory } from 'history';
import { Router, BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from 'components/maps/ParcelPopupView';
import { IProperty, IParcelDetail } from 'actions/parcelsActions';
import Map from './Map';
import { Marker } from 'react-leaflet';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render, act } from '@testing-library/react';
import { PopupView } from '../PopupView';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import Axios from 'axios';

jest.mock('axios');
jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

// This will spoof the active parcel (the one that will populate the popup details)
const mockDetails: IParcelDetail = {
  propertyTypeId: 0,
  parcelDetail: {
    id: 1,
    pid: '000-000-000',
    pin: '',
    projectNumber: '',
    statusId: 0,
    classificationId: 0,
    municipality: '',
    zoning: '',
    zoningPotential: '',
    agencyId: 0,
    latitude: 48,
    longitude: 123,
    propertyStatus: 'active',
    classification: 'Core Operational',
    description: 'test',
    isSensitive: false,
    evaluations: [
      {
        date: '2019',
        key: '',
        value: 100000,
      },
    ],
    fiscals: [],
    address: {
      line1: '1234 mock Street',
      line2: 'N/A',
      city: 'Victoria',
      province: 'BC',
      postal: 'V1V1V1',
    },
    landArea: 'unknown',
    landLegalDescription: 'test',
    buildings: [],
    agency: 'FIN',
  },
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.PARCEL]: { parcelDetail: mockDetails },
  [reducerTypes.LEAFLET_CLICK_EVENT]: { parcelDetail: mockDetails },
});

// To check for alert message
const emptyDetails = null;

// This mocks the parcels of land a user can see - should be able to see 2 markers
const mockParcels = [
  { id: 1, latitude: 48, longitude: 123 },
  { id: 2, latitude: 50, longitude: 133 },
] as IProperty[];
const noParcels = [] as IProperty[];

const history = createMemoryHistory();
describe('MapProperties View', () => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [0],
      },
    },
  });

  it('ParcelPopupView renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <PopupView
              propertyTypeId={mockDetails.propertyTypeId}
              propertyDetail={mockDetails.parcelDetail}
            />
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Check that the markers have correct position given the mock parcel 1 above
  it('Renders the marker in correct position', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={mockDetails}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
          />
        </Router>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const marker = component.find(Marker).first();
    expect(marker.prop('position')).toStrictEqual([48, 123]);
  });

  // Ensure no markers are rendered when there are no parcels
  it('Should render 0 markers when there are no parcels', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={noParcels}
            selectedProperty={emptyDetails}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
          />
        </Router>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const marker = component.find(Marker);
    expect(marker.length).toBe(0);
  });

  // 2 parcels in mock data, check to see 2 markers are created
  it('Marker for each parcel is created', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={mockDetails}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
          />
        </Router>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const marker = component.find(Marker);
    expect(marker.length).toBe(2);
  });

  // When marker is clicked function to load the details should be called
  xit('Loads parcel details on click', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const onParcelClick = jest.fn();
    const component = mount(
      <Provider store={store}>
        <BrowserRouter>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={mockDetails}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={onParcelClick}
          />
        </BrowserRouter>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const marker = component.find(Marker).first();
    marker.simulate('click', { stopPropagation: () => undefined });
    expect(onParcelClick).toBeCalledTimes(1);
  });

  // Check that error message is displayed on null details
  it('Displays proper message when no details loaded', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ParcelPopupView parcel={emptyDetails} />
        </Router>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const alert = getByText('Failed to load parcel details.');
    expect(alert).toBeTruthy();
  });

  it('ParcelPopupView renders correctly when the agencies matches the current user', async () => {
    const promise = Promise.resolve(mockParcels);
    mockedAxios.get.mockImplementationOnce(() => promise);
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ParcelPopupView parcel={mockDetails.parcelDetail} />
        </Router>
      </Provider>,
    );
    await act(() => (promise as unknown) as Promise<void>);
    const update = getByText('Update');
    expect(update).toBeTruthy();
  });
});
