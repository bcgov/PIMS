import { fireEvent, render, waitFor } from '@testing-library/react';
import { cleanup } from '@testing-library/react-hooks';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';
import renderer from 'react-test-renderer';

import { ParentSelect } from './ParentSelect';
import { SelectOptions } from './Select';

const testOptions: SelectOptions = [
  { value: 1, label: 'parent', parent: '' },
  { value: 2, label: 'child', parentId: 1, parent: 'parent' },
  { value: 3, label: 'other', parent: '' },
];

xit('renders correctly', () => {
  const tree = renderer
    .create(
      <Formik onSubmit={noop} initialValues={{ classifiactionid: '' }}>
        <ParentSelect field="test" options={testOptions} filterBy={['parent', 'label']} />
      </Formik>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

afterEach(() => {
  cleanup();
});

it('groups correctly', async () => {
  const { container, getAllByRole, getByText } = render(
    <Formik onSubmit={noop} initialValues={{ classifiactionid: '' }}>
      <ParentSelect field="test" options={testOptions} filterBy={['parent', 'label']} />
    </Formik>,
  );
  const test = container.querySelector('input[name="test"]');
  await waitFor(() =>
    fireEvent.change(test!, {
      target: {
        value: 'parent',
      },
    }),
  );
  expect(getByText('child')).toBeInTheDocument();
  // child will render as option
  expect(getAllByRole('option')).toHaveLength(1);
  // clickable header as combobox, should only render one parent not both
  expect(getAllByRole('combobox')).toHaveLength(1);
  expect(getAllByRole('combobox')[0]).toHaveValue('parent');
});

it('changes to corresponding child value on click', async () => {
  const { container, getByRole } = render(
    <Formik onSubmit={noop} initialValues={{ classifiactionid: '' }}>
      <ParentSelect field="test" options={testOptions} filterBy={['parent', 'label']} />
    </Formik>,
  );
  const test = container.querySelector('input[name="test"]');
  await waitFor(() =>
    fireEvent.change(test!, {
      target: {
        value: 'parent',
      },
    }),
  );
  const childElement = getByRole('option');
  await waitFor(() => fireEvent.click(childElement));
  expect(test).toHaveValue('parent');
});

it('changes to corresponding parent value on click', async () => {
  const { container, getByRole } = render(
    <Formik onSubmit={noop} initialValues={{ classifiactionid: '' }}>
      <ParentSelect field="test" options={testOptions} filterBy={['parent', 'label']} />
    </Formik>,
  );
  const test = container.querySelector('input[name="test"]');
  await waitFor(() =>
    fireEvent.change(test!, {
      target: {
        value: 'parent',
      },
    }),
  );
  const parentElement = getByRole('combobox');
  await waitFor(() => fireEvent.click(parentElement));
  expect(test).toHaveValue('parent');
});
