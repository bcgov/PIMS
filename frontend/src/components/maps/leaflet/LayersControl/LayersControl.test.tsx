import 'leaflet';
import 'leaflet/dist/leaflet.css';

import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import L from 'leaflet';
import { noop } from 'lodash';
import { useState } from 'react';
import React from 'react';
import { createMapContainer, deferred } from 'utils/testUtils';

import LayersControl from './LayersControl';

jest.mock('axios');

// component under test
function Template({ openByDefault = false }) {
  const [open, setOpen] = useState(openByDefault);
  return <LayersControl open={open} setOpen={() => setOpen(!open)} />;
}

function setup(ui = <Template />, setMap = noop) {
  // create a promise to wait for the map to be ready (which happens after initial render)
  const { promise, resolve } = deferred();
  const wrapper = createMapContainer(resolve, setMap);
  const component = render(ui, { wrapper });
  return {
    component,
    ready: promise,
    findLayerList: () => document.querySelector('#layersContainer') as HTMLElement,
    findToggleButton: () => document.querySelector('#layersControlButton') as HTMLElement,
  };
}

function isLayerVisible(key: string, leaflet: any) {
  return Object.keys(leaflet._layers)
    .map((k) => leaflet._layers[k])
    .map((x) => x.options)
    .find((options) => options?.key === key);
}

describe('LayersControl View', () => {
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterEach(cleanup);

  it('renders correctly', () => {
    const { component } = setup();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('should render the layers control button', async () => {
    const { ready, findToggleButton } = setup();
    await waitFor(() => ready);
    const toggleBtn = findToggleButton();
    expect(toggleBtn).toBeInTheDocument();
  });

  it('should be closed by default', async () => {
    const { ready, findLayerList } = setup();
    await waitFor(() => ready);
    const layersContainer = findLayerList();
    expect(layersContainer).toBeInTheDocument();
    expect(layersContainer.className).toContain('closed');
  });

  it('when closed, clicking the button should open the layer list', async () => {
    const { ready, findLayerList, findToggleButton } = setup();
    await waitFor(() => ready);
    // when layer list is closed...
    const layersContainer = findLayerList();
    expect(layersContainer).toBeInTheDocument();
    expect(layersContainer.className).toContain('closed');
    // clicking the button should open it...
    const toggleBtn = findToggleButton();
    userEvent.click(toggleBtn);
    await waitFor(() => expect(layersContainer.className).not.toContain('closed'));
  });

  it('when open, clicking the button should close the layers list', async () => {
    const { ready, findLayerList, findToggleButton } = setup(<Template openByDefault={true} />);
    await waitFor(() => ready);
    // when layer list is open...
    const layersContainer = findLayerList();
    expect(layersContainer).toBeInTheDocument();
    expect(layersContainer.className).not.toContain('closed');
    // clicking the button should close it...
    const toggleBtn = findToggleButton();
    userEvent.click(toggleBtn);
    await waitFor(() => expect(layersContainer.className).toContain('closed'));
  });

  it('should enable the Parcels layer and disable the Municipality layer by default', async () => {
    let mapInstance: L.Map | undefined = undefined;
    function setMap(map: L.Map) {
      mapInstance = map;
    }
    const { ready } = setup(<Template />, setMap);
    await waitFor(() => ready);
    await waitFor(() => expect(mapInstance).toBeDefined());

    expect(isLayerVisible('parcelBoundaries', mapInstance)).toBeDefined();
    expect(isLayerVisible('municipalities', mapInstance)).toBeUndefined();
  });
});
