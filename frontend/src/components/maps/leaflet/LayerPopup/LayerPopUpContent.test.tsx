import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { render, cleanup } from '@testing-library/react';
import { IPopupContentProps, LayerPopupContent } from './LayerPopupContent';
import { Router } from 'react-router-dom';
import queryString from 'query-string';
import { LatLng, LatLngBounds } from 'leaflet';

const history = createMemoryHistory();
jest.mock('hooks/useApi');

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
    pid: '000000000',
    pid_number: '000000000',
    pin: '',
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
        <Router history={history}>
          <LayerPopupContent
            data={mockLayer.data}
            config={mockLayer.config}
            onAddToParcel={mockLayer.onAddToParcel}
          />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Populate details link does not appear on default', () => {
    const { queryByText } = render(
      <Router history={history}>
        <LayerPopupContent
          data={mockLayer.data}
          config={mockLayer.config}
          onAddToParcel={mockLayer.onAddToParcel}
        />
      </Router>,
    );
    const link = queryByText(/Populate property details/i);
    expect(link).toBeNull();
  });

  xit('Populate details link appears when sideBar open', () => {
    history.location.search = queryString.stringify({
      disabled: false,
      loadDraft: false,
      sidebar: true,
    });
    const { getByText } = render(
      <Router history={history}>
        <LayerPopupContent
          data={mockLayer.data}
          config={mockLayer.config}
          onAddToParcel={mockLayer.onAddToParcel}
        />
      </Router>,
    );
    const link = getByText(/Populate property details/i);
    expect(link).toBeInTheDocument();
  });

  it('Zoom link does not appear without bounds', () => {
    const { queryByText } = render(
      <Router history={history}>
        <LayerPopupContent
          data={mockLayer.data}
          config={mockLayer.config}
          onAddToParcel={mockLayer.onAddToParcel}
        />
      </Router>,
    );
    const link = queryByText(/Zoom/i);
    expect(link).toBeNull();
  });
});
