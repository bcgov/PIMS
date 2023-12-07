import Adapter from '@cfaester/enzyme-adapter-react-18';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { IParcel, IParcelDetail, IProperty } from 'actions/parcelsActions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PointClusterer from 'components/maps/leaflet/PointClusterer';
import Claims from 'constants/claims';
import { PropertyTypes } from 'constants/propertyTypes';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import { createMemoryHistory } from 'history';
import { PimsAPI, useApi } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Map as LeafletMap } from 'leaflet';
import React, { createRef } from 'react';
import { Marker } from 'react-leaflet';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import Map from './Map';
import { createPoints } from './mapUtils';
import SelectedPropertyMarker from './SelectedPropertyMarker/SelectedPropertyMarker';

const mockAxios = new MockAdapter(axios);
jest.mock('hooks/useKeycloakWrapper');
Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
jest.mock('hooks/useApi');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/mapview/',
  }),
}));

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [0];
const userAgency: number = 0;

// This mocks the parcels of land a user can see - should be able to see 3 markers
const mockParcels = [
  { id: 1, latitude: 48.455059, longitude: -123.496452, propertyTypeId: PropertyTypes.BUILDING },
  { id: 2, latitude: 53.917065, longitude: -122.749672, propertyTypeId: PropertyTypes.PARCEL },
  { id: 3, latitude: 48.455059, longitude: -123.496452, propertyTypeId: PropertyTypes.PARCEL },
] as IProperty[];
(useApi as unknown as jest.Mock<Partial<PimsAPI>>).mockReturnValue({
  loadProperties: jest.fn(async () => {
    return createPoints(mockParcels);
  }),
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
  lookupCode: { lookupCodes: [] },
  parcel: { propertyDetail: mockDetails, draftProperties: [] },
  leafletClickEvent: { parcelDetail: mockDetails },
});

// To check for alert message
const emptyDetails = null;
const noParcels = [] as IProperty[];

let history = createMemoryHistory();
describe('MapProperties View', () => {
  (useKeycloakWrapper as jest.Mock).mockReturnValue(
    new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
  );

  beforeEach(() => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    mockAxios.reset();
    jest.clearAllMocks();
    mockAxios.onAny().reply(200);
    cleanup();
    history = createMemoryHistory();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getMap = (
    mapRef: React.RefObject<LeafletMap>,
    properties: IProperty[],
    selectedProperty: any,
  ) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Map
            lat={48.43}
            lng={-123.37}
            zoom={14}
            properties={properties}
            selectedProperty={selectedProperty}
            agencies={[]}
            lotSizes={[]}
            administrativeAreas={[]}
          />
        </MemoryRouter>
      </Provider>
    );
  };

  it('Renders the marker in correct position', async () => {
    const mapRef = createRef<LeafletMap>();
    const component = mount(getMap(mapRef, mockParcels, mockDetails));
    await waitFor(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const selectedMarkers = component.find(SelectedPropertyMarker);
    expect(selectedMarkers.length).toEqual(1);
    const markerProps = selectedMarkers.first().props();
    expect(markerProps.position).toEqual([48, 123]);
  });

  it('Should render 0 markers when there are no parcels', async () => {
    const mapRef = createRef<LeafletMap>();
    const component = mount(getMap(mapRef, noParcels, emptyDetails));
    await waitFor(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const marker = component.find(Marker);
    expect(marker.length).toBe(0);
    const selectedMarker = component.find(SelectedPropertyMarker);
    expect(selectedMarker.length).toBe(0);
  });

  it('Renders the properties as cluster and on selected property', async () => {
    const mapRef = createRef<LeafletMap>();

    const component = mount(getMap(mapRef, mockParcels, mockDetails));

    await waitFor(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    const marker = component.find(Marker);
    const selectedMarker = component.find(SelectedPropertyMarker).first();
    expect(selectedMarker).toBeDefined();
    await waitFor(
      () => {
        expect(marker.length).toBe(1);
      },
      { timeout: 500 },
    );
  });

  it('by default makes the expected calls to load map data', async () => {
    const mapRef = createRef<LeafletMap>();

    mount(getMap(mapRef, noParcels, emptyDetails));

    const { loadProperties } = useApi();
    const bbox = (loadProperties as jest.Mock).mock.calls.map((call) => call[0].bbox);
    const expectedBbox = [
      '-146.25,-135,55.77657301866769,61.60639637138628',
      '-146.25,-135,48.922499263758255,55.77657301866769',
      '-146.25,-135,40.97989806962013,48.922499263758255',
      '-135,-123.75,55.77657301866769,61.60639637138628',
      '-135,-123.75,48.922499263758255,55.77657301866769',
      '-135,-123.75,40.97989806962013,48.922499263758255',
      '-123.75,-112.5,55.77657301866769,61.60639637138628',
      '-123.75,-112.5,48.922499263758255,55.77657301866769',
      '-123.75,-112.5,40.97989806962013,48.922499263758255',
    ]; //given our map dimensions and center point, this array should never change.
    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(9), { timeout: 500 });
    expect(bbox).toEqual(expectedBbox);
  });

  it('makes the correct calls to load map data when filter updated.', async () => {
    const mapRef = createRef<LeafletMap>();

    const { container } = render(getMap(mapRef, noParcels, emptyDetails));
    const nameInput = container.querySelector('#name-field');
    fireEvent.change(nameInput!, {
      target: {
        value: 'testname',
      },
    });
    fireEvent.blur(nameInput!);
    const searchButton = container.querySelector('#search-button');
    fireEvent.click(searchButton!);

    const { loadProperties } = useApi();
    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(18), { timeout: 500 });
    expect((loadProperties as jest.Mock).mock.calls[9][0].name).toBe('testname');
  });

  it('PointClusterer clusters 2 points together', async () => {
    const mapRef = createRef<LeafletMap>();

    const component = mount(getMap(mapRef, mockParcels, emptyDetails));
    await waitFor(() => expect(mapRef.current).toBeDefined(), { timeout: 500 });
    // Get cluster
    const cluster = component.find(PointClusterer);
    // Ensure there's only 1
    await waitFor(
      () => {
        expect(cluster.length).toBe(1);
      },
      { timeout: 500 },
    );
  });

  it('Clicking markers opens the side menu (custom marker click provided)', async () => {
    const onMarkerClick = jest.fn();
    const getMapAlternateClick = (
      mapRef: React.RefObject<LeafletMap>,
      properties: IProperty[],
      selectedProperty: any,
    ) => {
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <Map
              lat={48.43}
              lng={-123.37}
              zoom={14}
              properties={properties}
              selectedProperty={selectedProperty}
              agencies={[]}
              lotSizes={[]}
              administrativeAreas={[]}
              onMarkerClick={onMarkerClick}
              mapRefExternal={mapRef}
            />
          </MemoryRouter>
        </Provider>
      );
    };
    const mapRef = createRef<LeafletMap>();
    const component = render(getMapAlternateClick(mapRef, mockParcels, mockDetails));
    await waitFor(() => expect(mapRef.current).not.toBeNull(), { timeout: 500 });
    let markers = component.container.querySelectorAll('.leaflet-marker-icon');
    expect(markers.length).toBe(1); // Only the cluster
    await waitFor(() => {
      fireEvent.click(markers.item(0)); // Click to open the cluster
    });
    markers = component.container.querySelectorAll('.leaflet-marker-icon');
    expect(markers.length).toBe(4); // Cluster and three markers
    await waitFor(() => {
      fireEvent.click(markers.item(1)); // Click a marker to open side menu (Building)
      fireEvent.click(markers.item(2)); // Click a marker to open side menu (Land)
    });

    expect(onMarkerClick).toBeCalledTimes(3); // Clicked once for cluster, twice for markers
  });

  it('Clicking markers opens the side menu (no custom marker click provided)', async () => {
    const onMarkerClick = jest.fn();
    const getMapAlternateClick = (
      mapRef: React.RefObject<LeafletMap>,
      properties: IProperty[],
      selectedProperty: any,
    ) => {
      return (
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <Map
              lat={48.43}
              lng={-123.37}
              zoom={14}
              properties={properties}
              selectedProperty={selectedProperty}
              agencies={[]}
              lotSizes={[]}
              administrativeAreas={[]}
              mapRefExternal={mapRef}
            />
          </MemoryRouter>
        </Provider>
      );
    };
    const mapRef = createRef<LeafletMap>();
    const component = render(getMapAlternateClick(mapRef, mockParcels, mockDetails));
    await waitFor(() => expect(mapRef.current).not.toBeNull(), { timeout: 500 });
    let markers = component.container.querySelectorAll('.leaflet-marker-icon');
    expect(markers.length).toBe(1); // Only the cluster
    await waitFor(() => {
      fireEvent.click(markers.item(0)); // Click to open the cluster
    });
    markers = component.container.querySelectorAll('.leaflet-marker-icon');
    expect(markers.length).toBe(4); // Cluster and three markers
    await waitFor(() => {
      fireEvent.click(markers.item(1)); // Click a marker to open side menu (Building)
      fireEvent.click(markers.item(2)); // Click a marker to open side menu (Land)
    });

    // A better check desired here, but can't figure how to track the setLayersOpen and setInfoOpen calls.
    expect(onMarkerClick).toBeCalledTimes(0); // Not called at all, because it used the default behaviour.
  });

  xit('filter will fire everytime the search button is clicked', async () => {
    const mapRef = createRef<LeafletMap>();

    const { container } = render(getMap(mapRef, noParcels, emptyDetails));
    const searchButton = container.querySelector('#search-button');
    fireEvent.click(searchButton!);

    const { loadProperties } = useApi();
    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(18), { timeout: 500 });
  });

  xit('makes the correct calls to load the map data when the reset filter is clicked', async () => {
    const mapRef = createRef<LeafletMap>();

    const { container } = render(getMap(mapRef, noParcels, emptyDetails));
    const { loadProperties } = useApi();

    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(9), { timeout: 500 });

    const nameInput = container.querySelector('#name-field');
    fireEvent.change(nameInput!, {
      target: {
        value: 'testname',
      },
    });
    fireEvent.blur(nameInput!);

    const searchButton = container.querySelector('#search-button');
    fireEvent.click(searchButton!);
    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(18), { timeout: 500 });
    const resetButton = container.querySelector('#reset-button');
    fireEvent.click(resetButton!);
    await waitFor(() => expect(loadProperties).toHaveBeenCalledTimes(18), { timeout: 500 });

    expect((loadProperties as jest.Mock).mock.calls[18][0].name).toBe('');
  });
});
