import React, { createRef } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { ParcelPopupView } from 'components/maps/ParcelPopupView';
import { IProperty, IParcelDetail } from 'actions/parcelsActions';
import Map from './Map';
import { Map as LeafletMap } from 'leaflet';
import { MapProps as LeafletMapProps, Map as ReactLeafletMap } from 'react-leaflet';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react';
import { PopupView } from '../PopupView';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { useApi, PimsAPI } from 'hooks/useApi';
import { createPoints } from './mapUtils';
import PointClusterer from './PointClusterer';

jest.mock('axios');
jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
jest.mock('hooks/useApi');

// This mocks the parcels of land a user can see - should be able to see 2 markers
const mockParcels = [
  { id: 1, latitude: 48.455059, longitude: -123.496452, propertyTypeId: 1 },
  { id: 2, latitude: 53.917065, longitude: -122.749672, propertyTypeId: 0 },
] as IProperty[];
((useApi as unknown) as jest.Mock<Partial<PimsAPI>>).mockReturnValue({
  loadProperties: async () => {
    return createPoints(mockParcels);
  },
});

// This will spoof the active parcel (the one that will populate the popup details)
const mockDetails: IParcelDetail = {
  propertyTypeId: 0,
  parcelDetail: {
    id: 1,
    name: 'test name',
    pid: '000-000-000',
    pin: '',
    projectNumber: '',
    classificationId: 0,
    zoning: '',
    zoningPotential: '',
    agencyId: 0,
    latitude: 48,
    longitude: 123,
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
      administrativeArea: '',
      provinceId: 'BC',
      postal: 'V1V1V1',
    },
    landArea: '',
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

  xit('Renders the marker in correct position', async (done: any) => {
    const mapRef = createRef<ReactLeafletMap<LeafletMapProps, LeafletMap>>();
    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={mockDetails}
            administrativeAreas={[]}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
            mapRef={mapRef}
          />
        </Router>
      </Provider>,
    );
    const cluster = component.find(PointClusterer).first();
    expect(cluster.props().selected).toBeDefined();
    expect(cluster.props().selected!.position).toEqual([48, 123]);
    done();
  });

  xit('Should render 0 markers when there are no parcels', async (done: any) => {
    const mapRef = createRef<ReactLeafletMap<LeafletMapProps, LeafletMap>>();
    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={emptyDetails}
            administrativeAreas={[]}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
            mapRef={mapRef}
          />
        </Router>
      </Provider>,
    );
    const cluster = component.find(PointClusterer).first();
    expect(cluster.props().selected).toBeNull();
    expect(cluster.props().points.length).toBe(0);
    done();
  });

  xit('Renders the properties as cluster and one selected property', async () => {
    const mapRef = createRef<ReactLeafletMap<LeafletMapProps, LeafletMap>>();

    const component = mount(
      <Provider store={store}>
        <Router history={history}>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={mockParcels}
            selectedProperty={mockDetails}
            administrativeAreas={[]}
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
            mapRef={mapRef}
            onViewportChanged={jest.fn()}
          />
        </Router>
      </Provider>,
    );

    const cluster = component.find(PointClusterer).first();
    expect(cluster.props().selected).toBeDefined();
  });

  // Check that error message is displayed on null details
  it('Displays proper message when no details loaded', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ParcelPopupView parcel={emptyDetails} />
        </Router>
      </Provider>,
    );

    const alert = getByText('Failed to load parcel details.');
    expect(alert).toBeTruthy();
  });

  it('ParcelPopupView renders correctly when the agencies matches the current user', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ParcelPopupView parcel={mockDetails.parcelDetail} />
        </Router>
      </Provider>,
    );

    const update = getByText('Update');
    expect(update).toBeTruthy();
  });
});
