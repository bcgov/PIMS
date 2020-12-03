import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Container, Button } from 'react-bootstrap';
import { SteppedForm, useFormStepper } from '.';
import { Input } from '..';
import { render } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

const FormContentComponent = () => {
  const stepper = useFormStepper();
  return (
    <Container>
      <Input field="data.name" placeholder="Name" />

      <p>Form inputs and control button here</p>
      <Button onClick={() => stepper.gotoStep(3)} variant="outline-info">
        Go to
      </Button>
      <Button onClick={stepper.goBack} variant="outline-info">
        Back
      </Button>
      <Button onClick={stepper.gotoNext} variant="outline-info">
        Next Step
      </Button>
      <Button type="submit">Save</Button>
    </Container>
  );
};

const Component = () => {
  return (
    <SteppedForm
      steps={[
        { route: 'building-id', title: 'Building ID', completed: false, canGoToStep: true },
        { route: 'tenancy', title: 'Tenancy', completed: false, canGoToStep: true },
        { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
        { route: 'parcel', title: 'Parcel', completed: false, canGoToStep: true },
        { route: 'review', title: 'Review', completed: false, canGoToStep: true },
      ]}
      initialValues={{
        activeStep: 0,
        data: { name: 'Quartech HQ' },
      }}
      persistable
      persistProps={{
        name: 'testForm',
        secret: 'secret',
        persistCallback: console.log,
      }}
      onSubmit={console.log}
    >
      <FormContentComponent />
    </SteppedForm>
  );
};

describe('SteppedForm', () => {
  it('component renders correctly', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
