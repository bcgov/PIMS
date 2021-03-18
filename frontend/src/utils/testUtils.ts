import { wait, fireEvent, act } from '@testing-library/react';
import { Map as LeafletMap, Layer } from 'leaflet';

export const fillInput = async (
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

  await wait(() => {
    if (type === 'input') {
      fireEvent.change(input!, {
        target: {
          value: value,
        },
      });
      fireEvent.focusOut(input);
    } else if (type === 'typeahead') {
      fireEvent.focus(input!);
      fireEvent.change(input!, {
        target: {
          value: value,
        },
      });
      const select = container.querySelector(`[aria-label="${value}"]`);
      fireEvent.click(select!);
      fireEvent.focusOut(input);
    } else if (type === 'datepicker') {
      fireEvent.mouseDown(input!);
      fireEvent.change(input!, {
        target: {
          value: value,
        },
      });
      fireEvent.keyPress(input!, { key: 'Enter', code: 'Enter' });
    } else if (type === 'radio') {
      fireEvent.click(input);
      fireEvent.focusOut(input);
    } else {
      fireEvent.change(input!, {
        target: {
          value: value,
        },
      });
      fireEvent.focusOut(input);
    }
    fireEvent.blur(input!);
  });
  return { input };
};

export const getInput = (container: HTMLElement, name: string, type: string = 'input') => {
  const input = container.querySelector(`${type}[name="${name}"]`);
  return input;
};

export const getLeafletLayers = (map?: LeafletMap): Layer[] => {
  if (!map) {
    return [];
  }
  return Object.keys((map as any)._layers).map(key => (map as any)._layers[key]);
};
