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
import { mockFlatProperty } from 'mocks/filterDataMock';
import { deletePotentialSubdivisionParcels } from 'features/projects/common';

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
describe('Review Approve actions', () => {
  describe('approval button', () => {
    (useFormikContext as jest.Mock).mockReturnValue({
      values: {
        properties: [{ ...mockFlatProperty, propertyTypeId: 2 }],
        statusCode: ReviewWorkflowStatus.PropertyReview,
      },
      submitForm: () => Promise.resolve(),
      validateForm: () => ({
        then: (func: Function) => func({}),
      }),
    });
    const component = mount(element);
    afterAll(() => {
      jest.clearAllMocks();
      component.unmount();
    });

    it('displays confirmation when clicking approve', () => {
      const button = component.findWhere((node: { type: () => any; text: () => string }) => {
        return node.type() === Button && node.text() === 'Approve';
      });
      button.simulate('click');
      return Promise.resolve().then(() => {
        expect(component.find(GenericModal)).toHaveLength(1);
      });
    });

    it('calls the function to change the status id', () => {
      const confirm = component
        .find(GenericModal)
        .findWhere((node: { type: () => any; text: () => string }) => {
          return node.type() === Button && node.text() === 'Approve';
        });
      confirm.simulate('click');
      expect(mockSubmit).toHaveBeenCalledWith(ReviewWorkflowStatus.ApprovedForErp);
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('denial button', () => {
    (useFormikContext as jest.Mock).mockReturnValue({
      values: {
        properties: [{ ...mockFlatProperty, propertyTypeId: 2 }],
        statusCode: ReviewWorkflowStatus.PropertyReview,
      },
      submitForm: () => Promise.resolve(),
    });
    const component = mount(element);

    afterAll(() => {
      jest.clearAllMocks();
      component.unmount();
    });

    it('displays confirmation when clicking deny', () => {
      const button = component.findWhere((node: { type: () => any; text: () => string }) => {
        return node.type() === Button && node.text() === 'Deny';
      });
      button.simulate('click');
      expect(component.find(GenericModal)).toHaveLength(1);
    });

    it('displays subdivision warning when project contains subdivisions when clicking deny', () => {
      const warning = component
        .find(GenericModal)
        .findWhere((node: { type: () => any; text: () => string }) => {
          return node.type() === 'p' && node.text() === deletePotentialSubdivisionParcels;
        });
      expect(warning).toHaveLength(1);
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

  describe('buttons state when project pending approval', () => {
    (useFormikContext as jest.Mock).mockReturnValue({
      values: {
        properties: [{ ...mockFlatProperty, propertyTypeId: 2 }],
        statusCode: ReviewWorkflowStatus.PropertyReview,
      },
      submitForm: () => Promise.resolve(),
    });
    const component = mount(element);

    const approve = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Approve';
    });
    const save = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Save';
    });
    const deny = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Deny';
    });
    afterAll(() => {
      jest.clearAllMocks();
      component.unmount();
    });

    it('Deny button enabled', () => {
      expect(deny.prop('disabled')).toBe(false);
    });

    it('Save button enabled', () => {
      expect(save.prop('disabled')).toBe(false);
    });

    it('Approve button enabled', () => {
      expect(approve.prop('disabled')).toBe(false);
    });
  });

  describe('buttons state when project denied', () => {
    (useFormikContext as jest.Mock).mockReturnValue({
      values: {
        statusCode: ReviewWorkflowStatus.Denied,
        properties: [{ ...mockFlatProperty, propertyTypeId: 2 }],
      },
      submitForm: () => Promise.resolve(),
    });
    const component = mount(element);
    const approve = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Approve';
    });
    const save = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Save';
    });
    const deny = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Deny';
    });

    afterAll(() => {
      jest.clearAllMocks();
      component.unmount();
    });

    it('disables Approve button if already denied', () => {
      expect(deny.prop('disabled')).toBe(true);
    });

    it('disables Save button if already denied', () => {
      expect(save.prop('disabled')).toBe(true);
    });

    it('disables Approve button if already denied', () => {
      expect(approve.prop('disabled')).toBe(true);
    });
  });

  describe('buttons state when project approved', () => {
    (useFormikContext as jest.Mock).mockReturnValue({
      values: {
        statusCode: ReviewWorkflowStatus.ApprovedForErp,
        properties: [{ ...mockFlatProperty, propertyTypeId: 2 }],
      },
      submitForm: () => Promise.resolve(),
    });
    const component = mount(element);
    const approve = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Approve';
    });
    const deny = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Deny';
    });

    afterAll(() => {
      jest.clearAllMocks();
      component.unmount();
    });

    it('disables Deny button if already approved', () => {
      expect(deny.prop('disabled')).toBe(true);
    });

    it('disables Approve button if already approved', () => {
      expect(approve.prop('disabled')).toBe(true);
    });
  });
});
