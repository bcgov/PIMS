import { fireEvent } from '@testing-library/dom';
import { act, render, waitFor } from '@testing-library/react';
import Claims from 'constants/claims';
import { Formik } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import { Form } from 'react-bootstrap';
<<<<<<< HEAD:frontend/src/features/projects/dispose/components/ApprovalConfirmation.test.tsx
import useKeycloakMock from 'useKeycloakWrapperMock';

import ApprovalConfirmationForm from '../../common/forms/ApprovalConfirmationForm';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
=======
import { vi } from 'vitest';

import ApprovalConfirmationForm from '../../common/forms/ApprovalConfirmationForm';

vi.mock('@react-keycloak/web');
>>>>>>> 3f673034 (Changed jest to vitest, 17 tests failing):frontend/src/features/projects/dispose/components/ApprovalConfirmation.spec.tsx

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
<<<<<<< HEAD:frontend/src/features/projects/dispose/components/ApprovalConfirmation.test.tsx
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
    );
=======
    useKeycloak.mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['1'],
        },
        subject: 'test',
      },
    });
>>>>>>> 3f673034 (Changed jest to vitest, 17 tests failing):frontend/src/features/projects/dispose/components/ApprovalConfirmation.spec.tsx
  });
  afterEach(() => {
    vi.clearAllMocks();
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
    const submitFn = vi.fn();
    const { getByLabelText } = renderComponent(true, submitFn);
    const input = getByLabelText('has approval/authority', { exact: false });
    act(() => {
      fireEvent.click(input);
    });
    waitFor(() => {
      expect(submitFn).toHaveBeenCalledWith({ confirmation: true });
    });
  });
});
