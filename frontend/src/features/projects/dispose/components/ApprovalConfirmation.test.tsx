import React from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import ApprovalConfirmationForm from '../../common/forms/ApprovalConfirmationForm';
import { useKeycloak } from '@react-keycloak/web';
import { noop } from 'lodash';

import { fireEvent } from '@testing-library/dom';
import { render, act, wait } from '@testing-library/react';

jest.mock('@react-keycloak/web');

const renderComponent = (isReadOnly: boolean, onSubmit?: (values: any) => void) => {
  //const userDisplayName = 'PIMS User';
  return render(
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <ApprovalConfirmationForm isReadOnly={isReadOnly} />
        <button onClick={onSubmit ?? noop}>Submit</button>
      </Form>
    </Formik>,
  );
};

describe('Approval Confirmation', () => {
  beforeEach(() => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['1'],
        },
        subject: 'test',
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Matches Snapshot', () => {
    const { container } = renderComponent(false);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Input is disabled if form is readonly', () => {
    const { getByLabelText } = renderComponent(true);
    expect(getByLabelText('confirm by checking this box', { exact: false })).toBeDisabled();
  });

  it('default user is displayed if no valid keycloak user available', () => {
    const { getByText } = renderComponent(true);
    expect(getByText('I, Pims User', { exact: false })).toBeVisible();
  });

  it('default user is displayed if no valid keycloak user available', () => {
    jest.clearAllMocks();
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['1'],
          name: 'Test User',
        },
        subject: 'test',
      },
    });
    const { getByText } = renderComponent(true);
    expect(getByText('I, Test User', { exact: false })).toBeVisible();
  });

  it('formik submitted values as expected', () => {
    const submitFn = jest.fn();
    act(() => {
      const { getByLabelText } = renderComponent(true, submitFn);
      const input = getByLabelText('confirm by checking this box', { exact: false });

      fireEvent.click(input);
    });
    wait(() => {
      expect(submitFn).toHaveBeenCalledWith({ confirmation: true });
    });
  });
});
