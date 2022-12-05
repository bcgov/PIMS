import { LayoutWrapper, ProjectLayout, useStepForm } from 'features/projects/common';
import { FormikValues } from 'formik';
import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import SelectProjectPropertiesStep from '../../dispose/steps/SelectProjectPropertiesStep';

const FlexRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
`;

/**
 * Display the SelectProjectPropertiesForm without the stepper and with custom action buttons.
 */
const SelectProjectPropertiesPage = () => {
  const formikRef = useRef<FormikValues>();
  const navigate = useNavigate();
  const { onSave } = useStepForm();

  const SelectProjectPropertiesPageContent = () => {
    return (
      <>
        <SelectProjectPropertiesStep formikRef={formikRef} />
        <FlexRight>
          <Button
            onClick={() => {
              onSave(formikRef).then(() => navigate(-1));
            }}
          >
            Update
          </Button>
        </FlexRight>
      </>
    );
  };

  return (
    <LayoutWrapper
      layout={ProjectLayout}
      component={SelectProjectPropertiesPageContent}
    ></LayoutWrapper>
  );
};

export default SelectProjectPropertiesPage;
