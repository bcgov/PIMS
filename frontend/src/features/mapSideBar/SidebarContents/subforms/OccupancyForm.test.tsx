import React from 'react';
import { OccupancyForm } from './OccupancyForm';
import { fireEvent, render, wait } from '@testing-library/react';
import { noop } from 'lodash';
import { Formik } from 'formik';
import { SelectOptions } from 'components/common/form';

const mockOccupancies: SelectOptions = [
  { value: 0, label: 'Occupancy Type 1' },
  { value: 1, label: 'Occupancy Type 2' },
  { value: 2, label: 'Occupancy Type 3' },
];

const form = (
  <Formik initialValues={{ assessedLand: '' }} onSubmit={noop}>
    {(props: any) => <OccupancyForm formikProps={props} occupantTypes={mockOccupancies} />}
  </Formik>
);

it('renders correctly', () => {
  const { container } = render(form);
  expect(container.firstChild).toMatchSnapshot();
});

it('number input for total area/square footage', async () => {
  const { container } = render(form);
  const totalArea = container.querySelector('input[name="totalArea"]');
  await wait(() => {
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
  await wait(() => {
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
  await wait(() => {
    fireEvent.change(percentage!, {
      target: {
        value: '123',
      },
    });
  });
  expect(percentage).toHaveValue('123');
});
