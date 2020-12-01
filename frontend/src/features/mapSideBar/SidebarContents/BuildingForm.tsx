import { SteppedForm, useFormStepper } from 'components/common/form/StepForm';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import * as API from 'constants/API';
import { IParcel } from 'actions/parcelsActions';
import { TenancyForm } from './subforms/TenancyForm';
import { IdentificationForm } from './subforms/IdentificationForm';
import { BuildingReviewPage } from './subforms/BuildingReviewPage';
import { BuildingValuationForm } from './subforms/BuildingValuationForm';
import { getInitialValues, valuesToApiFormat } from './LandForm';
import { defaultBuildingValues } from 'features/properties/components/forms/subforms/BuildingForm';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { BuildingSteps } from 'constants/propertySteps';
import useDraftMarkerSynchronizer from 'features/properties/hooks/useDraftMarkerSynchronizer';

const Container = styled.div`
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const FormContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
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
  position: sticky;
  background-color: #f2f2f2;
  bottom: 40px;
`;

const FillRemainingSpace = styled.span`
  flex: 1 1 auto;
`;

/**
 * A component used for submitting standalone buildings or buildings grouped with land.
 * This form will appear after selecting 'Add Building' after navigating to Manage Property > Submit Property in PIMS
 * @component
 */

interface IFormProps {
  /** determine whether certain fields are editable */
  isAdmin?: boolean;
  /** to change the user's cursor when adding a marker */
  setMovingPinNameSpace: (nameSpace: string) => void;
  /** to help determine the namespace of the field (eg. address.line1) */
  nameSpace: string;
}
const Form: React.FC<IFormProps> = ({ isAdmin, setMovingPinNameSpace, nameSpace }) => {
  const stepper = useFormStepper();
  useDraftMarkerSynchronizer();
  const formikProps = useFormikContext<IParcel>();
  const { getOptionsByType } = useCodeLookups();

  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
  const predominateUses = getOptionsByType(API.PREDOMINATE_USE_CODE_SET_NAME);
  const constructionType = getOptionsByType(API.CONSTRUCTION_CODE_SET_NAME);
  const occupancyType = getOptionsByType(API.OCCUPANT_TYPE_CODE_SET_NAME);

  const render = (): React.ReactNode => {
    switch (stepper.current) {
      case BuildingSteps.IDENTIFICATION:
        return (
          <div className="identification">
            <IdentificationForm
              formikProps={formikProps}
              constructionType={constructionType}
              predominateUses={predominateUses}
              classifications={classifications}
              agencies={agencies}
              setMovingPinNameSpace={setMovingPinNameSpace}
              nameSpace={nameSpace}
              isAdmin={isAdmin}
            />
          </div>
        );
      case BuildingSteps.TENANCY:
        return (
          <TenancyForm
            formikProps={formikProps}
            occupantTypes={occupancyType}
            nameSpace={nameSpace}
          />
        );
      case BuildingSteps.VALUATION:
        return <BuildingValuationForm nameSpace={nameSpace} formikProps={formikProps} />;
      case BuildingSteps.REVIEW:
        return (
          <BuildingReviewPage
            classifications={classifications}
            agencies={agencies}
            occupantTypes={occupancyType}
            predominateUses={predominateUses}
            constructionType={constructionType}
            nameSpace={nameSpace}
          />
        );
    }
  };

  return (
    <FormContentWrapper>
      <FormContent>{render()}</FormContent>
      <FormFooter>
        <InventoryPolicy />
        <FillRemainingSpace />
        {stepper.current !== 3 && (
          <Button style={{ marginRight: 10 }} size="sm" onClick={() => stepper.gotoNext()}>
            Continue
          </Button>
        )}
        {formikProps.dirty && stepper.current === 3 && (
          <Button type="submit">Submit to Inventory</Button>
        )}
      </FormFooter>
    </FormContentWrapper>
  );
};

interface IBuildingForm {
  /** to pass the formik ref */
  formikRef?: any;
  /** to change the user's cursor when adding a marker */
  setMovingPinNameSpace: (nameSpace: string) => void;
  /** to help determine the namespace of the field (eg. address.line1) */
  nameSpace: string;
  /** to help with the nameSpace of fields for fields in list form (eg. financials, buildings) */
  index: string;
  /** to determine whether certain locked fields can be editable */
  isAdmin?: boolean;
}

const BuidingForm: React.FC<IBuildingForm> = ({
  setMovingPinNameSpace,
  nameSpace,
  index,
  isAdmin,
  formikRef,
}) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  let initialValues = {
    activeStep: 0,
    activeTab: 0,
    data: { ...getInitialValues(), buildings: [{ ...defaultBuildingValues }] },
  };

  initialValues.data.buildings.forEach(
    (x: { agencyId: number | undefined }) => (x.agencyId = keycloak.agencyId),
  );

  return (
    <Container className="buildingForm">
      <SteppedForm
        // Provide the steps
        steps={[
          { route: 'building-id', title: 'Building Info', completed: false, canGoToStep: true },
          { route: 'tenancy', title: 'Occupancy', completed: false, canGoToStep: true },
          { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
          { route: 'review', title: 'Review & Submit', completed: false, canGoToStep: true },
        ]}
        persistable={true}
        persistProps={{
          name: 'building',
          secret: keycloak.obj.subject,
          persistCallback: noop,
        }}
        // provide initial building props
        initialValues={initialValues}
        formikRef={formikRef}
        // Provide onSubmit
        onSubmit={async (values, actions) => {
          const apiValues = valuesToApiFormat(_.cloneDeep(values));

          //temporary until we support buildings with no parcel
          apiValues.latitude = apiValues.buildings[0].latitude;
          apiValues.longitude = apiValues.buildings[0].longitude;
          apiValues.agencyId = apiValues.buildings[0].agencyId;
          apiValues.classificationId = apiValues.buildings[0].classificationId;

          try {
            if (!values.data.id) {
              await createParcel(apiValues)(dispatch);
            } else {
              await updateParcel(apiValues)(dispatch);
            }
          } catch (error) {
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        <Form
          isAdmin={isAdmin}
          setMovingPinNameSpace={setMovingPinNameSpace}
          nameSpace={withNameSpace('')}
        />
      </SteppedForm>
    </Container>
  );
};

export default BuidingForm;
