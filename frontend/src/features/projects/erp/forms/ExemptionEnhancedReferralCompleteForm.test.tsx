import * as React from 'react';
import { IProject } from 'features/projects/common/interfaces';
import { Formik, Form } from 'formik';
import ExemptionEnhancedReferralCompleteForm from './ExemptionEnhancedReferralCompleteForm';
import renderer from 'react-test-renderer';
import { noop } from 'lodash';
import { render, wait, fireEvent } from '@testing-library/react';
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
  it('Should render successfully', () => {
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
