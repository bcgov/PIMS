import { wait, fireEvent } from '@testing-library/react';
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
