import { fireEvent, render, waitFor } from '@testing-library/react';
import { LegendControl } from 'components/maps/leaflet/Legend/LegendControl';
import React from 'react';
import { createMapContainer, deferred } from 'utils/testUtils';

// component under test
const Template = () => <LegendControl />;

// this component needs a wrapper/context provider to work
const setup = (ui = <Template />) => {
  // create a promise to wait for the map to be ready (which happens after initial render)
  const { promise, resolve } = deferred();
  const component = render(ui, { wrapper: createMapContainer(resolve) });
  return { component, ready: promise };
};

describe('Testing LegendControl Component', () => {
  it('Control button renders correctly', () => {
    const { component } = setup();
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('Click LegendControl button', async () => {
    const { component, ready } = setup();
    const { container, getByText } = component;
    await waitFor(() => ready);
    // Get and click button to open legend
    const legendButton = container.querySelector('.legend-button');
    expect(legendButton).not.toBeNull();
    await waitFor(() => {
      fireEvent.click(legendButton!);
    });
    // Make sure all lines of he legend are there
    expect(getByText('Parcel')).toBeInTheDocument();
    expect(getByText('Building')).toBeInTheDocument();
    expect(getByText('Proposed Subdivision')).toBeInTheDocument();
    expect(getByText('Enhanced Referral Process')).toBeInTheDocument();
    expect(getByText('Surplus Properties List')).toBeInTheDocument();
  });
});
