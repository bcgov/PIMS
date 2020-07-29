import React from 'react';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import EnhancedReferralTab from './EnhancedReferralTab';
import { ReviewWorkflowStatus } from 'features/projects/common';
import { Formik, Form } from 'formik';

describe('EnhancedReferralTab', () => {
  it('renders correctly', () => {
    const form = (
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
    );
    const tree = renderer.create(form).toJSON();
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
