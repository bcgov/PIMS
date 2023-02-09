import Adapter from '@cfaester/enzyme-adapter-react-18';
import GenericModal from 'components/common/GenericModal';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import { DisposeWorkflowStatus } from 'features/projects/constants';
import { useFormikContext } from 'formik';
import { createMemoryHistory } from 'history';
import { WorkflowStatus } from 'hooks/api/projects';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Button } from 'react-bootstrap';
import { MemoryRouter } from 'react-router-dom';
import { Mock, vi } from 'vitest';

import { ReviewApproveActions } from './ReviewApproveActions';

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();

vi.mock('formik');
vi.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as Mock).mockReturnValue({ hasClaim: () => true });

const mockSubmit = vi.fn();
afterEach(() => {
  vi.clearAllMocks();
});

const element = (
  <MemoryRouter initialEntries={[history.location]}>
    <ReviewApproveActions
      submitStatusCode={DisposeWorkflowStatus.Draft}
      setSubmitStatusCode={mockSubmit}
      isSubmitting={false}
    />
  </MemoryRouter>
);

describe('approve exemption review actions', () => {
  (useFormikContext as Mock).mockReturnValue({
    values: {
      exemptionRequested: true,
    },
    submitForm: () => Promise.resolve(),
    validateForm: () => ({
      // eslint-disable-next-line @typescript-eslint/ban-types
      then: (func: Function) => func({}),
    }),
  });
  const component = mount(element);

  it('displays confirmation when clicking approve', () => {
    const button = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Approve';
    });
    button.simulate('click');
    expect(component.find(GenericModal)).toHaveLength(1);
  });

  it('calls the function to change the status id', () => {
    const confirm = component
      .find(GenericModal)
      .findWhere((node: { type: () => any; text: () => string }) => {
        return node.type() === Button && node.text() === 'Approve';
      });
    confirm.simulate('click');
    expect(mockSubmit).toHaveBeenCalledWith(WorkflowStatus.ApprovedForExemption);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('deny exemption review actions', () => {
  (useFormikContext as Mock).mockReturnValue({
    values: {
      exemptionRequested: true,
    },
    submitForm: () => Promise.resolve(),
    validateForm: () => Promise.resolve({}),
  });
  const component = mount(element);

  it('displays confirmation when clicking Deny', () => {
    const button = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Deny';
    });
    button.simulate('click');
    expect(component.find(GenericModal)).toHaveLength(1);
  });

  it('calls the function to change the status id', () => {
    const confirm = component
      .find(GenericModal)
      .findWhere((node: { type: () => any; text: () => string }) => {
        return node.type() === Button && node.text() === 'Deny';
      });
    confirm.simulate('click');
    expect(mockSubmit).toHaveBeenCalledWith(WorkflowStatus.Denied);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
