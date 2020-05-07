import { wait, fireEvent } from '@testing-library/react';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import { act } from 'react-test-renderer';

export const fillInput = async (
  container: HTMLElement,
  name: string,
  value: any,
  type: string = 'input',
) => {
  const input = container.querySelector(`${type}[name="${name}"]`);
  await wait(() => {
    act(() => {
      if (type === 'input') {
        fireEvent.change(input!, {
          target: {
            value: value,
          },
        });
      } else {
        fireEvent.change(input!, {
          target: {
            value: value,
          },
        });
      }
      fireEvent.blur(input!);
    });
  });
};

export const ensureGridApiHasBeenSet = (component: any) => {
  return waitForAsyncCondition(() => {
    return component.find(AgGridReact).instance().api !== undefined;
  }, 10);
};

export const waitForAsyncCondition = (condition: any, maxAttempts: number, attempts = 0) =>
  new Promise(function(resolve, reject) {
    (function waitForCondition() {
      // we need to wait for the gridReady event before we can start interacting with the grid
      // in this case we're looking at the api property in our App component, but it could be
      // anything (ie a boolean flag)
      if (condition()) {
        // once our condition has been met we can start the tests
        return resolve();
      }
      attempts++;

      if (attempts >= maxAttempts) {
        reject('Max timeout waiting for condition');
      }

      // not set - wait a bit longer
      setTimeout(waitForCondition, 10);
    })();
  });
