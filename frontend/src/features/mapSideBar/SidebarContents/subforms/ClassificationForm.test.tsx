import React from 'react';
import { ClassificationForm } from './ClassificationForm';
import renderer from 'react-test-renderer';
import { Formik } from 'formik';
import { Classifications } from 'constants/classifications';
import { cleanup, fireEvent, render, wait } from '@testing-library/react';
import { noop } from 'lodash';

const mockClassifications = [
  { value: Classifications.CoreOperational, label: 'Core Operational' },
  { value: Classifications.CoreStrategic, label: 'Core Strategic' },
  { value: Classifications.SurplusEncumbered, label: 'Surplus Encumbered' },
];

it('renders correctly', () => {
  const tree = renderer.create(form).toJSON();
  expect(tree).toMatchSnapshot();
});

const form = (
  <Formik onSubmit={noop} initialValues={{ classificationId: '' }}>
    <ClassificationForm classifications={mockClassifications} field="classificationId" />
  </Formik>
);

describe('renders definitions correctly', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  it('renders default defintion', () => {
    const { getByText } = render(form);
    expect(getByText(/select a classification/i)).toBeInTheDocument();
  });
  it('renders core operational definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.CoreOperational,
        },
      });
    });
    expect(getByText(/core Operational – assets that are functionally/i)).toBeInTheDocument();
  });
  it('renders core strategic definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.CoreStrategic,
        },
      });
    });
    expect(getByText(/core Strategic – assets that are uniquely/i)).toBeInTheDocument();
  });
  it('renders surplus encumbered definition', async () => {
    const { getByText, container } = render(form);
    const classificationId = container.querySelector('select[name="classificationId"]');
    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: Classifications.SurplusEncumbered,
        },
      });
    });
    expect(getByText(/surplus Encumbered – assets that are surplus/i)).toBeInTheDocument();
  });
});
