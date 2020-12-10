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
  <Formik initialValues={{ assessed: '' }} onSubmit={noop}>
    {(props: any) => <OccupancyForm formikProps={props} occupantTypes={mockOccupancies} />}
  </Formik>
);

it('renders correctly', () => {
  const { container } = render(form);
  expect(container.firstChild).toMatchSnapshot();
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

it('renders correct occupancies', async () => {
  const { container, getAllByRole } = render(form);
  const occupantType = container.querySelector('select[name="buildingOccupantTypeId"]');
  const options = getAllByRole('option');
  await wait(() => {
    fireEvent.click(occupantType!);
  });
  // 4 because it counts 'Must Select One'
  expect(options).toHaveLength(4);
  // Renders props correctly
  expect(options[1]).toHaveTextContent('Occupancy Type 1');
  expect(options[2]).toHaveTextContent('Occupancy Type 2');
  expect(options[3]).toHaveTextContent('Occupancy Type 3');
});

it('transfer lease on sale defaults to false', async () => {
  const { container } = render(form);
  const transfer = container.querySelector('input[name="transferLeaseOnSale"]');
  expect(transfer).not.toBeChecked();
});
