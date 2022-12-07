import { cleanup, render } from '@testing-library/react';
import { SidebarContextType } from 'features/mapSideBar/hooks/useQueryParamSideBar';
import { createMemoryHistory } from 'history';
import { LatLng, LatLngBounds } from 'leaflet';
import queryString from 'query-string';
import React from 'react';
import { MapContainer } from 'react-leaflet';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import { IPopupContentProps, LayerPopupContent } from './LayerPopupContent';

jest.mock('hooks/useApi');
const history = createMemoryHistory();

const northEast = new LatLng(50.5, -120.7);
const southWest = new LatLng(50.3, -121.2);
const bounds = new LatLngBounds(southWest, northEast);

const mockLayer: IPopupContentProps = {
  config: {},
  data: {
    feature_area_sqm: '10000',
    feature_length_m: '500',
    municipality: 'Rural',
    objectid: '0',
    owner_type: 'Private',
    parcel_class: 'Subdivision',
    parcel_name: '000000000',
    parcel_start_date: '2020-01-01',
    parcel_status: 'Active',
    PID: '000000001',
    pid_number: '000000000',
    PIN: '1',
    plan_number: 'VIP00000',
    regional_district: 'Fake District',
    se_anno_cad_data: '',
    when_updated: '2020-01-01',
  },
  onAddToParcel: jest.fn(),
  bounds: bounds,
};
describe('Layer Popup Content', () => {
  afterEach(() => {
    cleanup();
  });

  it('Renders correctly', () => {
    const tree = renderer
      .create(
        <MemoryRouter initialEntries={[history.location]}>
          <MapContainer>
            <LayerPopupContent
              data={mockLayer.data}
              config={mockLayer.config}
              onAddToParcel={mockLayer.onAddToParcel}
              bounds={bounds}
            />
          </MapContainer>
        </MemoryRouter>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Populate details link does not appear on default', () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={[history.location]}>
        <MapContainer>
          <LayerPopupContent
            data={mockLayer.data}
            config={mockLayer.config}
            onAddToParcel={mockLayer.onAddToParcel}
            bounds={bounds}
          />
        </MapContainer>
      </MemoryRouter>,
    );
    const link = queryByText(/Populate property details/i);
    expect(link).toBeNull();
  });

  it('Populate details link appears when sideBar open', () => {
    history.push(
      `/mapview?${queryString.stringify({
        disabled: false,
        loadDraft: false,
        sidebar: true,
        sidebarContext: SidebarContextType.ADD_BUILDING,
      })}`,
    );
    const { getByText } = render(
      <MemoryRouter initialEntries={[history.location]}>
        <MapContainer>
          <LayerPopupContent
            data={mockLayer.data}
            config={mockLayer.config}
            onAddToParcel={mockLayer.onAddToParcel}
            bounds={bounds}
          />
        </MapContainer>
      </MemoryRouter>,
    );
    const link = getByText(/Populate property details/i);
    expect(link).toBeInTheDocument();
  });

  xit('Zoom link does not appear without bounds', () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={[history.location]}>
        <MapContainer>
          <LayerPopupContent
            data={mockLayer.data}
            config={mockLayer.config}
            onAddToParcel={mockLayer.onAddToParcel}
          />
        </MapContainer>
      </MemoryRouter>,
    );
    const link = queryByText(/Zoom/i);
    expect(link).toBeNull();
  });
});
