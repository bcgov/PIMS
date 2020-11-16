import { SteppedForm, useFormStepper } from 'components/common/form/StepForm';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';

const Container = styled.div`
  background-color: #fff;
  height: 100%;
  width: 100%;
`;

const FormContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const FormContent = styled.div`
  border-top: 1px solid #666666;
  width: 100%;
  min-height: 100px;
`;

const FormFooter = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
`;

const FillRemainingSpace = styled.span`
  flex: 1 1 auto;
`;

const Form = () => {
  const stepper = useFormStepper();

  return (
    <FormContentWrapper>
      <FormContent>
        {/*  */}
        <p>Form content here {stepper.current}</p>
      </FormContent>
      <FormFooter>
        <InventoryPolicy />
        <FillRemainingSpace />
        <Button size="sm">Continue</Button>
      </FormFooter>
    </FormContentWrapper>
  );
};

const BuidingForm = () => {
  const keycloak = useKeycloakWrapper();
  return (
    <Container>
      <SteppedForm
        // Provide the steps
        steps={[
          { route: 'building-id', title: 'Building ID', completed: false, canGoToStep: true },
          { route: 'tenancy', title: 'Tenancy', completed: false, canGoToStep: true },
          { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
          { route: 'parcel', title: 'Parcel', completed: false, canGoToStep: true },
          { route: 'review', title: 'Review', completed: false, canGoToStep: true },
        ]}
        persistable={true}
        persistProps={{
          name: 'building',
          secret: keycloak.obj.subject,
          persistCallback: noop,
        }}
        // provide initial building props
        initialValues={{
          activeStep: 0,
          data: { name: 'Building name' },
        }}
        // Provide onSubmit
        onSubmit={values => alert(JSON.stringify(values.data))}
      >
        <Form />
      </SteppedForm>
    </Container>
  );
};

export default BuidingForm;
