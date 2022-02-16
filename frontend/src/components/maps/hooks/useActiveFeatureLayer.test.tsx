import { useKeycloak } from '@react-keycloak/web';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useLayerQuery } from 'components/maps/leaflet/LayerPopup';
import { createMemoryHistory } from 'history';
import { geoJSON } from 'leaflet';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import useActiveFeatureLayer from './useActiveFeatureLayer';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const mapRef = { current: { leafletMap: {} } };
jest.mock('leaflet');
jest.mock('components/maps/leaflet/LayerPopup');
let clearLayers = jest.fn();
let addData = jest.fn();
let findOneWhereContains = jest.fn();

(geoJSON as jest.Mock).mockReturnValue({
  addTo: () => ({ clearLayers, addData } as any),
});
(useLayerQuery as jest.Mock).mockReturnValue({
  findOneWhereContains: findOneWhereContains,
});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const getStore = (values?: any) => mockStore(values ?? { parcel: { draftProperties: [] } });
const getWrapper =
  (store: any) =>
  ({ children }: any) =>
    (
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>{children}</MemoryRouter>
      </Provider>
    );

describe('useActiveFeatureLayer hook tests', () => {
  beforeEach(() => {
    clearLayers.mockClear();
    addData.mockClear();
    findOneWhereContains.mockClear();
  });
  afterEach(() => {});
  it('sets the active feature when layerPopup information is set', () => {
    renderHook(
      () =>
        useActiveFeatureLayer({
          mapRef: mapRef as any,
          selectedProperty: undefined,
          layerPopup: { feature: {} } as any,
          setLayerPopup: noop,
        }),
      {
        wrapper: getWrapper(getStore()),
      },
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(addData).toHaveBeenCalledTimes(1);
  });

  it('sets the active feature when there is a selected property', async () => {
    findOneWhereContains.mockResolvedValue({ features: [{}] });
    renderHook(
      () =>
        useActiveFeatureLayer({
          mapRef: mapRef as any,
          selectedProperty: { parcelDetail: { latitude: 1, longitude: 1 } } as any,
          layerPopup: undefined,
          setLayerPopup: noop,
        }),
      {
        wrapper: getWrapper(getStore()),
      },
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(geoJSON().addTo({} as any).addData).toHaveBeenCalledTimes(1));
  });

  it('does not set the active parcel when the selected property has no matching parcel data', async () => {
    findOneWhereContains.mockResolvedValue({});
    renderHook(
      () =>
        useActiveFeatureLayer({
          mapRef: mapRef as any,
          selectedProperty: { parcelDetail: { latitude: 1, longitude: 1 } } as any,
          layerPopup: undefined,
          setLayerPopup: noop,
        }),
      {
        wrapper: getWrapper(getStore()),
      },
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(geoJSON().addTo({} as any).addData).not.toHaveBeenCalled());
  });

  it('sets the active feature based on draft parcels', async () => {
    findOneWhereContains.mockResolvedValue({ features: [{}] });
    renderHook(
      () =>
        useActiveFeatureLayer({
          mapRef: mapRef as any,
          selectedProperty: undefined,
          layerPopup: undefined,
          setLayerPopup: noop,
        }),
      {
        wrapper: getWrapper(
          getStore({ parcel: { draftProperties: [{ geometry: { coordinates: [-122, 56] } }] } }),
        ),
      },
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(geoJSON().addTo({} as any).addData).toHaveBeenCalledTimes(1));
  });

  it('does not set the active parcel when the draft property has no matching parcel data', async () => {
    findOneWhereContains.mockResolvedValue({});
    renderHook(
      () =>
        useActiveFeatureLayer({
          mapRef: mapRef as any,
          selectedProperty: undefined,
          layerPopup: undefined,
          setLayerPopup: noop,
        }),
      {
        wrapper: getWrapper(
          getStore({ parcel: { draftProperties: [{ geometry: { coordinates: [-122, 56] } }] } }),
        ),
      },
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(geoJSON().addTo({} as any).addData).not.toHaveBeenCalled());
  });
});
