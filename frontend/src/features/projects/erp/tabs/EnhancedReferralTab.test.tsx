import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { noop } from 'lodash';
import EnhancedReferralTab from './EnhancedReferralTab';
import { ReviewWorkflowStatus } from 'features/projects/common';
import { Formik, Form } from 'formik';
import { getStore, mockProject as defaultProject } from '../../dispose/testUtils';
import _ from 'lodash';
import { Provider } from 'react-redux';

const mockProject = _.cloneDeep(defaultProject);

const createElement = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <Formik
      initialValues={{
        statusCode: ReviewWorkflowStatus.ApprovedForErp,
        projectAgencyResponses: [],
      }}
      validateOnChange={false}
      onSubmit={() => {}}
    >
      {formikProps => (
        <Form>
          <EnhancedReferralTab goToGreTransferred={noop} setSubmitStatusCode={noop} />
        </Form>
      )}
    </Formik>
  </Provider>
);

describe('EnhancedReferralTab', () => {
  it('renders correctly', () => {
    const element = createElement();
    const tree = renderer.create(element).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when approved for exemption', () => {
    const form = (
      <Formik
        initialValues={{ statusCode: ReviewWorkflowStatus.ApprovedForExemption }}
        validateOnChange={false}
        onSubmit={() => {}}
      >
        {formikProps => (
          <Form>
            <EnhancedReferralTab goToGreTransferred={noop} setSubmitStatusCode={noop} />
          </Form>
        )}
      </Formik>
    );
    const tree = renderer.create(form).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it('renders correctly when approved for exemption', () => {
  //   (useFormikContext as jest.Mock).mockReturnValue({
  //     values: {
  //       statusCode: ReviewWorkflowStatus.ApprovedForExemption,
  //     },
  //     setFieldValue: jest.fn(),
  //   });
  //   const tree = renderer
  //     .create(<EnhancedReferralTab goToGreTransferred={noop} setSubmitStatusCode={noop} />)
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});
