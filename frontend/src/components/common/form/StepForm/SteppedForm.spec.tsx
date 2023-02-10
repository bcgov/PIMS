import Adapter from '@cfaester/enzyme-adapter-react-18';
import { fireEvent } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import Enzyme from 'enzyme';
import React from 'react';
import { Button, Container } from 'react-bootstrap';

import { Input } from '..';
import { SteppedForm, useFormStepper } from '.';

Enzyme.configure({ adapter: new Adapter() });

const FormContentComponent = () => {
  const stepper = useFormStepper();
  return (
    <Container>
      <Input field="data.name" placeholder="Name" />

      <p>STEP: {stepper.current}</p>
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
        activeTab: 0,
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
  it('back on step 0 doesnt throw an error', () => {
    const { getByText } = render(<Component />);
    const backButton = getByText('Back');
    act(() => {
      fireEvent.click(backButton);
    });
    const currentStep = getByText('STEP: 0');
    expect(currentStep).toBeInTheDocument();
  });
  it('goes to the next page', async () => {
    const { getByText, findByText } = render(<Component />);
    const nextButton = getByText('Next Step');
    act(() => {
      fireEvent.click(nextButton);
    });
    const currentStep = await findByText('STEP: 1');
    expect(currentStep).toBeInTheDocument();
  });
  it('does not change page if next and back are clicked', async () => {
    const { findByText, getByText } = render(<Component />);
    const nextButton = getByText('Next Step');
    const backButton = getByText('Back');
    fireEvent.click(nextButton);
    await findByText('STEP: 1');
    fireEvent.click(backButton);
    await findByText('STEP: 0');
    const currentStep = getByText('STEP: 0');
    expect(currentStep).toBeInTheDocument();
  });
  it('jumps to a step', async () => {
    const { getByText, findByText } = render(<Component />);
    const jumpTo = getByText('Go to');
    act(() => {
      fireEvent.click(jumpTo);
    });

    const currentStep = await findByText('STEP: 3');
    expect(currentStep).toBeInTheDocument();
  });
});
