import React from 'react';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import EditButton from './EditButton';
import { render, cleanup } from '@testing-library/react';

const getEditButton = (setFormDisabled?: Function, formDisabled?: boolean) => {
  return <EditButton {...{ formDisabled, setFormDisabled }} />;
};

describe('Project Dispose Form Edit Button', () => {
  afterEach(() => {
    cleanup();
  });
  it('Matches Snapshot', () => {
    const component = renderer.create(getEditButton(noop, true));
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('The button is disabled if the form is not disabled', () => {
    const { getByText } = render(getEditButton(noop, true));
    const editButton = getByText('Edit');
    expect(editButton).toBeTruthy();
    expect(editButton).toBeVisible();
  });

  it('Edit Button is not visible if setIsSubmitting is undefined', () => {
    const { queryByText } = render(getEditButton(undefined, false));
    const editButton = queryByText('Edit');
    expect(editButton).toBeNull();
  });
});
