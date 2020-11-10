import { fireEvent, render, wait } from '@testing-library/react';
import React from 'react';
import { ParentGroupedFilter } from './ParentGroupedFilter';
import { SelectOption } from 'components/common/form';
import renderer from 'react-test-renderer';
import { Formik } from 'formik';
import { noop } from 'lodash';

const testOptions: SelectOption[] = [
  {
    label: 'One',
    code: 'TEST',
    value: 1,
  },
  {
    label: 'Two',
    code: 'ABC',
    value: 2,
    parentId: 1,
  },
];

const renderFilter = () =>
  render(
    <Formik onSubmit={noop} initialValues={{ test: '' }}>
      <ParentGroupedFilter name="test" options={testOptions} className="test-id" />
    </Formik>,
  );

it('ParentGroupedFilter renders', () => {
  const tree = renderer
    .create(
      <Formik onSubmit={noop} initialValues={{ test: '' }}>
        <ParentGroupedFilter
          name="test"
          options={testOptions}
          className="test-id"
          filterBy={['parent', 'code', 'name']}
        />
      </Formik>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should contain both options since both contain the letter o in their name', async () => {
  const { getAllByRole, container } = renderFilter();
  const test = container.querySelector('input[name="test"]');

  await wait(() => {
    fireEvent.change(test!, {
      target: {
        value: 'o',
      },
    });
  });
  expect(getAllByRole('option')).toHaveLength(2);
});

xit('filter by code', async () => {
  const { getAllByRole, container } = renderFilter();
  const test = container.querySelector('input[name="test"]');

  await wait(() => {
    fireEvent.change(test!, {
      target: {
        value: 'ABC',
      },
    });
  });
  expect(getAllByRole('option')).toHaveLength(1);
  expect(getAllByRole('option')[0]).toHaveTextContent('Two');
});

xit('filter by parent', async () => {
  const { getAllByRole, container } = renderFilter();
  const test = container.querySelector('input[name="test"]');

  await wait(() => {
    fireEvent.change(test!, {
      target: {
        value: 'One',
      },
    });
  });
  expect(getAllByRole('option')).toHaveLength(2);
});
