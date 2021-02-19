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
    expect(getByLabelText('has approval/authority', { exact: false })).toBeDisabled();
  });

  it('My ministry/agency displays for non SRES', () => {
    const { getByText } = renderComponent(false);
    expect(getByText('My Ministry/Agency', { exact: false })).toBeVisible();
  });

  it('formik submitted values as expected', () => {
    const submitFn = jest.fn();
    act(() => {
      const { getByLabelText } = renderComponent(true, submitFn);
      const input = getByLabelText('has approval/authority', { exact: false });

      fireEvent.click(input);
    });
    wait(() => {
      expect(submitFn).toHaveBeenCalledWith({ confirmation: true });
    });
  });
});
