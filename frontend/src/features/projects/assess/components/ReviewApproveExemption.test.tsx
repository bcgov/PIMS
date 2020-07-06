import React from 'react';
import { useFormikContext } from 'formik';
import { ReviewApproveActions } from './ReviewApproveActions';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Button } from 'react-bootstrap';
import GenericModal from 'components/common/GenericModal';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ReviewWorkflowStatus, DisposeWorkflowStatus } from '../../common/interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();

jest.mock('formik');
jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue({ hasClaim: () => true });

const mockSubmit = jest.fn();
afterEach(() => {
  jest.clearAllMocks();
});

const element = (
  <Router history={history}>
    <ReviewApproveActions
      submitStatusCode={DisposeWorkflowStatus.Draft}
      setSubmitStatusCode={mockSubmit}
      isSubmitting={false}
    />
  </Router>
);

describe('approve exemption review actions', () => {
  (useFormikContext as jest.Mock).mockReturnValue({
    values: {
      exemptionRequested: true,
    },
    submitForm: () => Promise.resolve(),
    validateForm: () => ({
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
    expect(mockSubmit).toHaveBeenCalledWith(ReviewWorkflowStatus.ApprovedForExemption);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('deny exemption review actions', () => {
  (useFormikContext as jest.Mock).mockReturnValue({
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
    expect(mockSubmit).toHaveBeenCalledWith(ReviewWorkflowStatus.Denied);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});
