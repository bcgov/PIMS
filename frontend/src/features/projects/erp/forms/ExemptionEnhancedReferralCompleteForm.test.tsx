import { act, fireEvent, render, screen } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import { IProject } from 'features/projects/interfaces';
import { Form, Formik, FormikProps } from 'formik';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import _ from 'lodash';
import * as React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import { getStore, mockProject as defaultProject } from '../../dispose/testUtils';
import ExemptionEnhancedReferralCompleteForm from './ExemptionEnhancedReferralCompleteForm';

Enzyme.configure({ adapter: new Adapter() });
const history = createMemoryHistory();
const mockProject = _.cloneDeep(defaultProject);

const element = (func: Function, storeOverride?: any) => (
  <Provider store={storeOverride ?? getStore(mockProject)}>
    <MemoryRouter initialEntries={[history.location]}>
      <FormComponent
        values={{
          ...testProject,
          requestForSplReceivedOn: '2020-01-01',
          approvedForSplOn: '2020-01-01',
        }}
        addToErp={noop}
        onClickGreTransferred={noop}
        onClickNotInSpl={noop}
        onClickProceedToSpl={func}
        onClickDisposedExternally={noop}
      />
    </MemoryRouter>
  </Provider>
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
  market: 1,
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
  statusHistory: [],
};

const FormComponent: React.FC<{
  values: object;
  addToErp: any;
  onClickGreTransferred: any;
  onClickProceedToSpl: any;
  onClickNotInSpl: any;
  onClickDisposedExternally: any;
  formRef?: React.MutableRefObject<FormikProps<any> | undefined>;
}> = (props) => (
  <Formik
    innerRef={(instance) => {
      if (props.formRef && instance) props.formRef.current = instance;
    }}
    initialValues={props.values}
    onSubmit={(values) => {}}
  >
    <Form>
      <ExemptionEnhancedReferralCompleteForm
        onClickAddToErp={props.addToErp}
        onClickGreTransferred={props.onClickGreTransferred}
        onClickNotInSpl={props.onClickNotInSpl}
        onClickProceedToSpl={props.onClickProceedToSpl}
        onClickDisposedExternally={props.onClickProceedToSpl}
      />
    </Form>
  </Formik>
);

describe('ExemptionEnhancedReferralCompleteForm', () => {
  beforeAll(() => {
    const { getComputedStyle } = window;
    window.getComputedStyle = (elt) => getComputedStyle(elt);
  });
  it('renders successfully', () => {
    const tree = renderer
      .create(
        <FormComponent
          values={testProject}
          addToErp={noop}
          onClickGreTransferred={noop}
          onClickNotInSpl={noop}
          onClickProceedToSpl={noop}
          onClickDisposedExternally={noop}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('disables form buttons when Clearance Notification Date is empty', async () => {
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
        onClickDisposedExternally={noop}
      />,
    );

    const findButton = (name: string | RegExp) =>
      findByRole('button', { name: typeof name === 'string' ? new RegExp(name, 'i') : name });
    const setClearanceDate = (value: Date | '') => {
      formikRef?.current?.setFieldValue('clearanceNotificationSentOn', value);
    };
    const setTransferredGreDate = (value: Date | '') => {
      formikRef?.current?.setFieldValue('transferredWithinGreOn', value);
    };
    const setRequestAndApprovalForSpl = (value: Date | '') => {
      formikRef?.current?.setFieldValue('requestForSplReceivedOn', value);
      formikRef?.current?.setFieldValue('approvedForSplOn', value);
    };

    act(() => {
      setClearanceDate('');
    });

    expect(await findButton('Update Property Information')).toBeDisabled();
    expect(await findButton('Proceed to SPL')).toBeDisabled();

    // // ASSERT - 2 buttons should be enabled after clearance notification date is set
    act(() => {
      setClearanceDate(new Date(Date.UTC(2020, 5, 9, 8)));
    });

    expect(await findButton('Add to Enhanced Referral Process')).toBeEnabled();
    expect(await findButton('Not Included in the SPL')).toBeEnabled();
    expect(await findButton('Proceed to SPL')).toBeDisabled();

    // ASSERT - 3 buttons should be enabled after spl request and approval date is set
    act(() => {
      setRequestAndApprovalForSpl(new Date(Date.UTC(2020, 5, 9, 8)));
    });

    expect(await findButton('Add to Enhanced Referral Process')).toBeEnabled();
    expect(await findButton('Not Included in the SPL')).toBeEnabled();
    expect(await findButton('Proceed to SPL')).toBeEnabled();

    // ASSERT - GRE button should be enabled ONLY when GRE date set
    expect(await findButton('Update Property Information')).toBeDisabled();

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
        onClickDisposedExternally={noop}
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
        onClickDisposedExternally={noop}
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
        onClickDisposedExternally={noop}
      />,
    );

    const notInSplButton = getByRole('button', { name: /Not Included in the SPL/i });
    fireEvent.click(notInSplButton);
    expect(onClickNotInSpl).toHaveBeenCalledTimes(1);
  });

  const splClick = jest.fn();

  it('displays confirmation when clicking proceed to spl', async () => {
    const project = _.cloneDeep({
      ...mockProject,
    });

    const component = render(element(noop, getStore(project)));

    const proceedButton = component.getAllByText(/^Proceed to SPL$/)[0];
    act(() => {
      fireEvent.click(proceedButton);
    });

    await screen.findByText('Really Proceed to SPL?');
    var buttons = component.getAllByText(/^Proceed to SPL$/);
    const reallyProceedButton = buttons[1];

    expect(buttons).toHaveLength(2);
    expect(reallyProceedButton).toBeInTheDocument();
  });

  it('calls the appropriate function', async () => {
    const project = _.cloneDeep(mockProject);
    project.clearanceNotificationSentOn = new Date();
    project.requestForSplReceivedOn = new Date();
    project.approvedForSplOn = new Date();

    const component = render(element(splClick, getStore(project)));

    const proceedButton = component.getAllByText(/^Proceed to SPL$/)[0];
    act(() => {
      fireEvent.click(proceedButton);
    });

    await screen.findByText('Really Proceed to SPL?');
    const reallyProceedButton = component.getAllByText(/^Proceed to SPL$/)[1];
    act(() => {
      fireEvent.click(reallyProceedButton);
    });

    expect(splClick).toHaveBeenCalledTimes(1);
  });
});
