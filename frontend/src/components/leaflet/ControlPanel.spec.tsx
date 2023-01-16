import { cleanup, render, waitFor } from '@testing-library/react';
import React from 'react';
import { useEffect } from 'react';
import { createMapContainer, deferred } from 'utils/testUtils';

import ControlPanel from './ControlPanel';

// component under test
const Template = (args: L.ControlOptions) => (
  <ControlPanel {...args}>
    <div data-testid="custom-control">blah</div>
  </ControlPanel>
);

// this component needs a wrapper/context provider to work
const setup = (ui = <Template />) => {
  // create a promise to wait for the map to be ready (which happens after initial render)
  const { promise, resolve } = deferred();
  const component = render(ui, { wrapper: createMapContainer(resolve) });
  return { component, ready: promise };
};

describe('React Leaflet ControlPanel', () => {
  afterEach(cleanup);

  it('renders correctly', () => {
    const { component } = setup();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('renders the children', async () => {
    let rendered = false;
    function Child() {
      useEffect(() => {
        rendered = true;
      }, []);
      return null;
    }

    const { ready } = setup(
      <ControlPanel>
        <Child />
      </ControlPanel>,
    );

    await waitFor(() => ready);
    expect(rendered).toBe(true);
  });

  it('renders on top-right map corner by default', async () => {
    const { component, ready } = setup();
    const { getByTestId } = component;
    await waitFor(() => ready);
    const topRight = document.querySelector('.leaflet-top.leaflet-right') as Element;
    const div = getByTestId('custom-control');
    expect(div).toBeInTheDocument();
    expect(topRight.contains(div)).toBe(true);
  });

  it('renders on appropriate map corner from props', async () => {
    const { component, ready } = setup(<Template position="bottomleft" />);
    const { getByTestId } = component;
    await waitFor(() => ready);
    const bottomLeft = document.querySelector('.leaflet-bottom.leaflet-left') as Element;
    const div = getByTestId('custom-control');
    expect(div).toBeInTheDocument();
    expect(bottomLeft.contains(div)).toBe(true);
  });
});
