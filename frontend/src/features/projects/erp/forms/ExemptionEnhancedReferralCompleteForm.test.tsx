import * as React from 'react';
import { IProject } from 'features/projects/common/interfaces';
import { Formik, Form, FormikProps } from 'formik';
import ExemptionEnhancedReferralCompleteForm from './ExemptionEnhancedReferralCompleteForm';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import { render, fireEvent, act } from '@testing-library/react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import GenericModal from 'components/common/GenericModal';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();

const element = (func: Function) => (
  <Router history={history}>
    <FormComponent
      values={testProject}
      addToErp={noop}
      onClickGreTransferred={noop}
      onClickNotInSpl={noop}
      onClickProceedToSpl={func}
    />
  </Router>
);
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
  clearanceNotificationSentOn: new Date(Date.UTC(2020, 5, 9, 8)),
  transferredWithinGreOn: new Date(Date.UTC(2020, 5, 9, 8)),
  note: 'string',
  publicNote: '',
  privateNote: 'string',
  tasks: [],
  fiscalYear: 2021,
  projectAgencyResponses: [],
  notes: [],
};

const FormComponent: React.FC<{
  values: object;
  addToErp: any;
  onClickGreTransferred: any;
  onClickProceedToSpl: any;
  onClickNotInSpl: any;
  formRef?: React.MutableRefObject<FormikProps<any> | undefined>;
}> = props => (
  <Formik
    innerRef={instance => {
      props.formRef && (props.formRef.current = instance);
    }}
    initialValues={props.values}
    onSubmit={values => {}}
  >
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
  it('renders successfully', () => {
    const tree = renderer
      .create(
        <FormComponent
          values={testProject}
          addToErp={noop}
          onClickGreTransferred={noop}
          onClickNotInSpl={noop}
          onClickProceedToSpl={noop}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.only('requires Clearance Notification Date to be set before enabling action buttons', async () => {
    // need a ref here to change field values programmatically
    const formikRef = React.createRef<FormikProps<any>>();
    const { findByRole } = render(
      <FormComponent
        formRef={formikRef as React.MutableRefObject<FormikProps<any>>}
        values={testProject}
        addToErp={noop}
        onClickGreTransferred={noop}
        onClickNotInSpl={noop}
        onClickProceedToSpl={noop}
      />,
    );

    const findButton = (name: string) => findByRole('button', { name: new RegExp(name, 'i') });
    const setClearanceDate = (value: Date | '') => {
      formikRef?.current?.setFieldValue('clearanceNotificationSentOn', value);
    };
    const setTransferredGreDate = (value: Date | '') => {
      formikRef?.current?.setFieldValue('transferredWithinGreOn', value);
    };

    // ASSERT - all 4 buttons should be disabled when clearance notification date is empty
    act(() => {
      setClearanceDate('');
    });
    expect(await findButton('Add to Enhanced Referral Process')).toBeDisabled();
    expect(await findButton('Update Property Information')).toBeDisabled();
    expect(await findButton('Not Included in the SPL')).toBeDisabled();
    expect(await findButton('Proceed to SPL')).toBeDisabled();

    // ASSERT - 3 buttons should be enabled after clearance notification date is set
    act(() => {
      setClearanceDate(new Date(Date.UTC(2020, 5, 9, 8)));
    });
    expect(await findButton('Add to Enhanced Referral Process')).toBeEnabled();
    expect(await findButton('Not Included in the SPL')).toBeEnabled();
    expect(await findButton('Proceed to SPL')).toBeEnabled();

    // ASSERT - GRE button should be enabled ONLY when GRE date set
    act(() => {
      setTransferredGreDate(new Date(Date.UTC(2020, 5, 9, 8)));
    });
    expect(await findButton('Update Property Information')).toBeEnabled();
  });

  it('executes onClickGreTransferred callback', async () => {
    const onClickGreTransferred = jest.fn();
    const { getByRole } = render(
      <FormComponent
        values={testProject}
        addToErp={noop}
        onClickGreTransferred={onClickGreTransferred}
        onClickNotInSpl={noop}
        onClickProceedToSpl={noop}
      />,
    );

    const updatePropertiesButton = getByRole('button', { name: /Update Property Information/i });
    fireEvent.click(updatePropertiesButton);
    expect(onClickGreTransferred).toHaveBeenCalledTimes(1);
  });

  it('executes onClickAddToErp callback', async () => {
    const onClickAddToErp = jest.fn();
    const { getByRole } = render(
      <FormComponent
        values={testProject}
        addToErp={onClickAddToErp}
        onClickGreTransferred={noop}
        onClickNotInSpl={noop}
        onClickProceedToSpl={noop}
      />,
    );

    const addToErpButton = getByRole('button', { name: /Add to Enhanced Referral Process/i });
    fireEvent.click(addToErpButton);
    expect(onClickAddToErp).toHaveBeenCalledTimes(1);
  });

  it('executes onClickNotInSpl callback', async () => {
    const onClickNotInSpl = jest.fn();
    const { getByRole } = render(
      <FormComponent
        values={testProject}
        addToErp={noop}
        onClickGreTransferred={noop}
        onClickNotInSpl={onClickNotInSpl}
        onClickProceedToSpl={noop}
      />,
    );

    const notInSplButton = getByRole('button', { name: /Not Included in the SPL/i });
    fireEvent.click(notInSplButton);
    expect(onClickNotInSpl).toHaveBeenCalledTimes(1);
  });

  const splClick = jest.fn();
  const component = mount(element(splClick));

  it('displays confirmation when clicking proceed to spl', () => {
    const button = component.findWhere((node: { type: () => any; text: () => string }) => {
      return node.type() === Button && node.text() === 'Proceed to SPL';
    });
    button.simulate('click');
    return Promise.resolve().then(() => {
      expect(component.find(GenericModal)).toHaveLength(1);
    });
  });

  it('calls the appropriate function', () => {
    const confirm = component
      .find(GenericModal)
      .findWhere((node: { type: () => any; text: () => string }) => {
        return node.type() === Button && node.text() === 'Proceed to SPL';
      });
    confirm.simulate('click');
    expect(splClick).toHaveBeenCalledTimes(1);
  });
});
