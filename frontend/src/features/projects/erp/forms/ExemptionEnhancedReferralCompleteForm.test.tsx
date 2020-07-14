import * as React from 'react';
import { IProject } from 'features/projects/common/interfaces';
import { Formik, Form } from 'formik';
import ExemptionEnhancedReferralCompleteForm from './ExemptionEnhancedReferralCompleteForm';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import { render, wait, fireEvent } from '@testing-library/react';

const testProject: IProject = {
  id: 1,
  projectNumber: 'SPP-10000',
  name: 'LOADING',
  statusId: 15,
  statusCode: 'AP-EXE',
  tierLevelId: 1,
  description: '',
  agencyId: 35,
  netBook: 1,
  estimated: 1,
  properties: [],
  clearanceNotificationSentOn: new Date(),
  transferredWithinGreOn: new Date(),
  note: 'string',
  publicNote: '',
  privateNote: 'string',
  tasks: [],
  fiscalYear: 2021,
  projectAgencyResponses: [],
};

const FormComponent: React.FC<{
  addToErp: any;
  onClickGreTransferred: any;
  onClickProceedToSpl: any;
  onClickNotInSpl: any;
}> = props => (
  <Formik initialValues={testProject} onSubmit={values => {}}>
    <Form>
      <ExemptionEnhancedReferralCompleteForm
        onClickAddToErp={props.addToErp}
        onClickGreTransferred={props.onClickGreTransferred}
        onClickNotInSpl={props.onClickNotInSpl}
        onClickProceedToSpl={props.onClickProceedToSpl}
      />
    </Form>
  </Formik>
);

describe('ExemptionEnhancedReferralCompleteForm', () => {
  xit('Should render successfully', () => {
    const tree = renderer
      .create(
        <FormComponent
          addToErp={noop}
          onClickGreTransferred={noop}
          onClickNotInSpl={noop}
          onClickProceedToSpl={noop}
        />,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('Should execute onClickGreTransferred', async () => {
    const onClickGreTransferred = jest.fn();
    const { getByText } = render(
      <FormComponent
        addToErp={noop}
        onClickGreTransferred={onClickGreTransferred}
        onClickNotInSpl={noop}
        onClickProceedToSpl={noop}
      />,
    );

    const updatePropertiesButton = getByText('Update Property Information');
    await wait(() => fireEvent.click(updatePropertiesButton));
    expect(onClickGreTransferred).toHaveBeenCalledTimes(1);
  });

  it('Should execute onClickAddToErp', async () => {
    const onClickAddToErp = jest.fn();
    const { getByText } = render(
      <FormComponent
        addToErp={onClickAddToErp}
        onClickGreTransferred={noop}
        onClickNotInSpl={noop}
        onClickProceedToSpl={noop}
      />,
    );

    const addToErpButton = getByText('Add to Enhanced Referral Process');
    await wait(() => fireEvent.click(addToErpButton));
    expect(onClickAddToErp).toHaveBeenCalledTimes(1);
  });

  it('Should execute onClickNotInSpl', async () => {
    const onClickNotInSpl = jest.fn();
    const { getByText } = render(
      <FormComponent
        addToErp={noop}
        onClickGreTransferred={noop}
        onClickNotInSpl={onClickNotInSpl}
        onClickProceedToSpl={noop}
      />,
    );

    const notInSplButton = getByText('Not Included in the SPL');
    await wait(() => fireEvent.click(notInSplButton));
    expect(onClickNotInSpl).toHaveBeenCalledTimes(1);
  });
});
