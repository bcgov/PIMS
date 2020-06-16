import React from 'react';
import { noop } from 'lodash';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { ReviewApproveActions } from './ReviewApproveActions';
import { Formik } from 'formik';
import { IProject } from '..';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { ReviewWorkflowStatus, initialValues } from '../interfaces';

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue({ hasClaim: () => true });

const renderComponent = (values?: IProject, setSubmitStatusId?: Function) => {
  return render(
    <Formik onSubmit={noop} initialValues={values ?? {}}>
      <ReviewApproveActions submitStatusId={0} setSubmitStatusId={setSubmitStatusId ?? noop} />
    </Formik>,
  );
};

describe('Review Approve Actions', () => {
  afterEach(() => {
    cleanup();
  });

  it('submits deny status id when deny clicked', done => {
    const project = initialValues;
    const setStatusId = (val: number) => {
      expect(val).toBe(ReviewWorkflowStatus.Denied);
      done();
    };
    const { getByText } = renderComponent(project, setStatusId);
    const deny = getByText('Deny');

    act(() => {
      fireEvent.click(deny);
    });
  });

  it('submits approve status id when approve clicked', done => {
    const project = initialValues;
    const setStatusId = (val: number) => {
      expect(val).toBe(ReviewWorkflowStatus.ApprovedForErp);
      done();
    };
    const { getByText } = renderComponent(project, setStatusId);
    const approve = getByText('Approve');
    act(() => {
      fireEvent.click(approve);
    });
  });

  it('all buttons are enabled by default', () => {
    const project = initialValues;
    const { getByText } = renderComponent(project);
    expect(getByText('Deny')).not.toBeDisabled();
    expect(getByText('Approve')).not.toBeDisabled();
    expect(getByText('Save')).not.toBeDisabled();
  });

  it('disables Deny button if already denied', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.Denied;
    const { getByText } = renderComponent(project);
    expect(getByText('Deny')).toBeDisabled();
  });

  it('disables Deny button if already approved for ERP', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.ApprovedForErp;
    const { getByText } = renderComponent(project);
    expect(getByText('Deny')).toBeDisabled();
  });

  it('disables Save button if already denied', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.Denied;
    const { getByText } = renderComponent(project);
    expect(getByText('Deny')).toBeDisabled();
  });

  it('disables Approve button if already Denied', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.Denied;
    const { getByText } = renderComponent(project);
    expect(getByText('Approve')).toBeDisabled();
  });

  it('disables Approve button if already approved', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.ApprovedForErp;
    const { getByText } = renderComponent(project);
    expect(getByText('Approve')).toBeDisabled();
  });

  it('disables Approve button if already approved', () => {
    const project = initialValues;
    project.statusId = ReviewWorkflowStatus.ApprovedForErp;
    const { getByText } = renderComponent(project);
    expect(getByText('Approve')).toBeDisabled();
  });
});
