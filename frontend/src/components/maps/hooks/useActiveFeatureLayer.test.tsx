import useActiveFeatureLayer from './useActiveFeatureLayer';
import { renderHook } from '@testing-library/react-hooks';
import { geoJSON } from 'leaflet';
import { useLayerQuery } from 'components/maps/leaflet/LayerPopup';
import { wait } from '@testing-library/react';

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

describe('useActiveFeatureLayer hook tests', () => {
  beforeEach(() => {
    clearLayers.mockClear();
    addData.mockClear();
    findOneWhereContains.mockClear();
  });
  afterEach(() => {});
  it('sets the active feature when layerPopup information is set', () => {
    renderHook(() =>
      useActiveFeatureLayer({
        mapRef: mapRef as any,
        selectedProperty: undefined,
        layerPopup: { feature: {} } as any,
      }),
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(addData).toHaveBeenCalledTimes(1);
  });

  it('sets the active feature when there is a selected property', async () => {
    findOneWhereContains.mockResolvedValue({ features: [{}] });
    renderHook(() =>
      useActiveFeatureLayer({
        mapRef: mapRef as any,
        selectedProperty: { parcelDetail: { latitude: 0, longitude: 0 } } as any,
        layerPopup: undefined,
      }),
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await wait(() => {
      expect(geoJSON().addTo({} as any).addData).toHaveBeenCalledTimes(1);
    });
  });

  it('does not set the active parcel when the selected property has no matching parcel data', async () => {
    findOneWhereContains.mockResolvedValue({});
    renderHook(() =>
      useActiveFeatureLayer({
        mapRef: mapRef as any,
        selectedProperty: { parcelDetail: { latitude: 0, longitude: 0 } } as any,
        layerPopup: undefined,
      }),
    );
    expect(clearLayers).toHaveBeenCalled();
    expect(findOneWhereContains).toHaveBeenCalledTimes(1);
    await wait(() => {
      expect(geoJSON().addTo({} as any).addData).not.toHaveBeenCalled();
    });
  });
});
