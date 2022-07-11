import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { SelectOptions } from 'components/common/form';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';

import { OccupancyForm } from './OccupancyForm';

const mockOccupancies: SelectOptions = [
  { value: 0, label: 'Occupancy Type 1' },
  { value: 1, label: 'Occupancy Type 2' },
  { value: 2, label: 'Occupancy Type 3' },
];

const form = (
  <Formik
    initialValues={{ assessedLand: '', buildingTenancy: '', rentableArea: '', totalArea: '' }}
    onSubmit={noop}
  >
    {(props: any) => <OccupancyForm formikProps={props} occupantTypes={mockOccupancies} />}
  </Formik>
);

describe('occupancy form functionality', () => {
  it('renders correctly', () => {
    const { container } = render(form);
    act(() => {
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('number input for total area/square footage', async () => {
    const { container } = render(form);
    const totalArea = container.querySelector('input[name="totalArea"]');
    await waitFor(() => {
      fireEvent.change(totalArea!, {
        target: {
          value: 123,
        },
      });
    });
    expect(totalArea).toHaveValue(123);
  });

  it('number input for rentable area', async () => {
    const { container } = render(form);
    const rentableArea = container.querySelector('input[name="rentableArea"]');
    await waitFor(() => {
      fireEvent.change(rentableArea!, {
        target: {
          value: 123,
        },
      });
    });
    expect(rentableArea).toHaveValue(123);
  });

  it('input for tenancy percentage', async () => {
    const { container } = render(form);
    const percentage = container.querySelector('input[name="buildingTenancy"]');
    await waitFor(() => {
      fireEvent.change(percentage!, {
        target: {
          value: '123',
        },
      });
    });
    expect(percentage).toHaveValue('123');
  });
});
