import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import GenericModal from 'components/common/GenericModal';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import { DisposeWorkflowStatus, ReviewWorkflowStatus } from 'features/projects/constants';
import { useFormikContext } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Button } from 'react-bootstrap';
import { MemoryRouter } from 'react-router-dom';

import { ReviewApproveActions } from './ReviewApproveActions';

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
  <MemoryRouter initialEntries={[history.location]}>
    <ReviewApproveActions
      submitStatusCode={DisposeWorkflowStatus.Draft}
      setSubmitStatusCode={mockSubmit}
      isSubmitting={false}
    />
  </MemoryRouter>
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
