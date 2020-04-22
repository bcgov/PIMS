import { wait, fireEvent } from '@testing-library/react';

export const fillInput = async (
  container: HTMLElement,
  name: string,
  value: any,
  type: string = 'input',
) => {
  const input = container.querySelector(`${type}[name="${name}"]`);
  await wait(() => {
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
  });
};
