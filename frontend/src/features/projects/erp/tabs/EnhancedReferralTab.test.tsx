import 'jest-styled-components';

import { useKeycloak } from '@react-keycloak/web';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { Form, Formik } from 'formik';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import _ from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import { getStore, mockProject as defaultProject } from '../../dispose/testUtils';
import EnhancedReferralTab from './EnhancedReferralTab';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const mockProject = _.cloneDeep(defaultProject);
const history = createMemoryHistory();

const createElement = (storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <MemoryRouter initialEntries={[history.location]}>
      <Formik
        initialValues={{
          statusCode: ReviewWorkflowStatus.ApprovedForErp,
          projectAgencyResponses: [],
        }}
        validateOnChange={false}
        onSubmit={() => {}}
      >
        {(formikProps) => (
          <Form>
            <EnhancedReferralTab goToGreTransferred={noop} setSubmitStatusCode={noop} />
          </Form>
        )}
      </Formik>
    </MemoryRouter>
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
      <Provider store={getStore(mockProject)}>
        <MemoryRouter initialEntries={[history.location]}>
          <Formik
            initialValues={{ statusCode: ReviewWorkflowStatus.ApprovedForExemption }}
            validateOnChange={false}
            onSubmit={() => {}}
          >
            {(formikProps) => (
              <Form>
                <EnhancedReferralTab goToGreTransferred={noop} setSubmitStatusCode={noop} />
              </Form>
            )}
          </Formik>
        </MemoryRouter>
      </Provider>
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
