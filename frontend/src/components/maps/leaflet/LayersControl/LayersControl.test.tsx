import * as React from 'react';
import 'leaflet';
import { Map as LeafletMap } from 'leaflet';
import { Map as ReactLeafletMap, MapProps } from 'react-leaflet';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import LayersControl from './LayersControl';
import 'leaflet/dist/leaflet.css';
import { waitFor } from '@testing-library/dom';
import { Button } from 'react-bootstrap';

jest.mock('axios');
Enzyme.configure({ adapter: new Adapter() });

let mapRef: React.RefObject<ReactLeafletMap<MapProps, LeafletMap>> | undefined;

const MapComponent = () => {
  const [open, setOpen] = React.useState(false);
  mapRef = React.useRef<any>();
  return (
    <div id="mapid" style={{ width: 500, height: 500 }}>
      <ReactLeafletMap ref={mapRef} center={[48.423078, -123.360956]} zoom={18}>
        <LayersControl open={open} setOpen={() => setOpen(!open)} />
      </ReactLeafletMap>
    </div>
  );
};

const isLayerVisible = (key: string, leaflet: any) => {
  return Object.keys(leaflet._layers)
    .map(k => leaflet._layers[k])
    .map(x => x.options)
    .find(options => options?.key === key);
};

describe('LayersControl View', () => {
  beforeEach(() => {
    mapRef = undefined;
  });

  it('Should render the layers control button', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const layersButton = component.find(Button).first();
    expect(layersButton).toBeDefined();
    expect(layersButton.props().id).toBe('layersControlButton');
  });

  it('Should component to be closed by default', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const layersContainer = component.find('#layersContainer').first();
    expect(layersContainer).toBeDefined();
    expect(layersContainer.props().className?.includes('closed')).toBeTruthy();
  });

  it('Clicking the button should open the layers component', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const layersContainer = component.find('#layersContainer').first();
    const layersButton = component.find('#layersControlButton').first();
    expect(layersContainer).toBeDefined();
    expect(layersButton).toBeDefined();
    expect(layersContainer.props().className?.includes('closed')).toBeTruthy();
    layersButton.invoke('onClick');
    waitFor(() => expect(layersContainer.props().className?.includes('closed')).toBeFalsy(), {
      timeout: 500,
    });
  });

  it('Clicking the button should close the layers component', () => {
    const component = mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    const layersContainer = component.find('#layersContainer').first();
    const layersButton = component.find('#layersControlButton').first();
    expect(layersContainer).toBeDefined();
    expect(layersButton).toBeDefined();
    expect(layersContainer.props().className?.includes('closed')).toBeTruthy();
    layersButton.invoke('onClick');
    waitFor(() => expect(layersContainer.props().className?.includes('closed')).toBeFalsy(), {
      timeout: 500,
    });
    layersButton.invoke('onClick');
    waitFor(() => expect(layersContainer.props().className?.includes('closed')).toBeTruthy(), {
      timeout: 500,
    });
  });

  it('Parcel should be enabled by default and Municipality layers should be disabled by default', () => {
    mount(<MapComponent />);
    waitFor(() => expect(mapRef?.current).toBeTruthy(), { timeout: 500 });
    expect(isLayerVisible('municipalities', mapRef!.current!.leafletElement)).toBeFalsy();
  });
});
