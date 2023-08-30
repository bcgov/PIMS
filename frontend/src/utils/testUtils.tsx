import { fireEvent } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { MapContainer, useMap } from 'react-leaflet';

/**
 * Utility type for generic props of component testing
 */
export interface PropsWithChildren {
  children?: React.ReactNode;
}

/**
 * Creates a Map wrapper for unit testing
 * @param done A callback that will be called when the map has finished rendering
 * @returns The map container instance
 *
 * @example
 *    const { promise, resolve } = deferred();
 *    render(<TestComponent/>, { wrapper: createMapContainer(resolve) })
 *    await waitFor(() => promise)
 *    // the map is fully initialized here...
 */
export function createMapContainer(
  done: () => void = noop,
  whenCreated: (map: L.Map | null) => void = noop,
) {
  return function Container({ children }: PropsWithChildren) {
    const MapController = () => {
      const map = useMap();
      React.useEffect(() => {
        whenCreated(map || null);
        done();
      }, []);

      return <></>;
    };

    return (
      <div id="mapid" style={{ width: 500, height: 500 }}>
        <MapContainer center={[48.43, -123.37]} zoom={14}>
          {children}
          <MapController />
        </MapContainer>
      </div>
    );
  };
}

export const deferred = () => {
  let resolve: (value?: unknown) => void = noop;
  const promise = new Promise((_resolve) => {
    resolve = _resolve;
  });
  return {
    resolve,
    promise,
  };
};

export const fillInput = (
  container: HTMLElement,
  name: string,
  value: any,
  type: string = 'input',
) => {
  let input: any = undefined;
  if (type === 'radio') {
    input = container.querySelector(`#input-${name}`);
  } else {
    if (type === 'typeahead' || type === 'datepicker') {
      input = container.querySelector(`input[name="${name}"]`);
    } else {
      input = container.querySelector(`${type}[name="${name}"]`);
    }
  }

  if (type === 'input') {
    fireEvent.change(input, {
      target: {
        value: value,
      },
    });
    fireEvent.focusOut(input);
  } else if (type === 'typeahead') {
    fireEvent.focus(input);
    fireEvent.change(input, {
      target: {
        value: value,
      },
    });
    const select = container.querySelector(`[aria-label="${value}"]`);
    fireEvent.click(select!);
    fireEvent.focusOut(input);
  } else if (type === 'datepicker') {
    fireEvent.mouseDown(input);
    fireEvent.change(input, {
      target: {
        value: value,
      },
    });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' });
  } else if (type === 'radio') {
    fireEvent.click(input);
    fireEvent.focusOut(input);
  } else {
    fireEvent.change(input, {
      target: {
        value: value,
      },
    });
    fireEvent.focusOut(input);
  }
  fireEvent.blur(input);
  return { input };
};
