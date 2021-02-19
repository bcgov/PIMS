import React, { createRef } from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { IProperty, IParcelDetail, IParcel } from 'actions/parcelsActions';
import Map from './Map';
import { Map as LeafletMap } from 'leaflet';
import { MapProps as LeafletMapProps, Marker, Map as ReactLeafletMap } from 'react-leaflet';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { useApi, PimsAPI } from 'hooks/useApi';
import { createPoints } from './mapUtils';
import SelectedPropertyMarker from './SelectedPropertyMarker/SelectedPropertyMarker';
import { fetchPropertyNames } from 'actionCreators/propertyActionCreator';

jest.mock('axios');
jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
jest.mock('hooks/useApi');
jest.mock('actionCreators/propertyActionCreator');

(fetchPropertyNames as any).mockImplementation(jest.fn(() => () => ['test']));

// This mocks the parcels of land a user can see - should be able to see 2 markers
const mockParcels = [
  { id: 1, latitude: 48.455059, longitude: -123.496452, propertyTypeId: 1 },
  { id: 2, latitude: 53.917065, longitude: -122.749672, propertyTypeId: 0 },
] as IProperty[];
((useApi as unknown) as jest.Mock<Partial<PimsAPI>>).mockReturnValue({
  loadProperties: async () => {
    return createPoints(mockParcels);
  },
  getParcel: async () => {
    return {} as IParcel;
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
    encumbranceReason: '',
    assessedBuilding: 0,
    assessedLand: 0,
    projectNumbers: [],
    classificationId: 0,
    zoning: '',
    zoningPotential: '',
    agencyId: 0,
    latitude: 48,
    longitude: 123,
    classification: 'Core Operational',
    description: 'test',
    isSensitive: false,
    parcels: [],
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
  [reducerTypes.PARCEL]: { parcelDetail: mockDetails, draftParcels: [] },
  [reducerTypes.LEAFLET_CLICK_EVENT]: { parcelDetail: mockDetails },
});

// To check for alert message
const emptyDetails = null;

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

  it('Renders the marker in correct position', async () => {
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
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
            mapRef={mapRef}
            administrativeAreas={[]}
          />
        </Router>
      </Provider>,
    );
    wait(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const selectedMarkers = component.find(SelectedPropertyMarker);
    expect(selectedMarkers.length).toEqual(1);
    const markerProps = selectedMarkers.first().props();
    expect(markerProps.position).toEqual([48, 123]);
  });

  it('Should render 0 markers when there are no parcels', async () => {
    const mapRef = createRef<ReactLeafletMap<LeafletMapProps, LeafletMap>>();
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
            mapRef={mapRef}
            administrativeAreas={[]}
          />
        </Router>
      </Provider>,
    );
    wait(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const marker = component.find(Marker);
    expect(marker.length).toBe(0);
    const selectedMarker = component.find(SelectedPropertyMarker);
    expect(selectedMarker.length).toBe(0);
  });

  it('Renders the properties as cluster and on selected property', async () => {
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
            agencies={[]}
            propertyClassifications={[]}
            lotSizes={[]}
            onMarkerClick={jest.fn()}
            mapRef={mapRef}
            onViewportChanged={jest.fn()}
            administrativeAreas={[]}
          />
        </Router>
      </Provider>,
    );

    await wait(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const marker = component.find(Marker);
    const selectedMarker = component.find(SelectedPropertyMarker).first();
    expect(selectedMarker).toBeDefined();
    await wait(
      () => {
        expect(marker.length).toBe(1);
      },
      { timeout: 500 },
    );
  });
});
