import { SteppedForm, useFormStepper, ISteppedFormValues } from 'components/common/form/StepForm';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import * as API from 'constants/API';
import { IParcel, IBuilding } from 'actions/parcelsActions';
import { OccupancyForm } from './subforms/OccupancyForm';
import { IdentificationForm } from './subforms/IdentificationForm';
import { BuildingReviewPage } from './subforms/BuildingReviewPage';
import { BuildingValuationForm } from './subforms/BuildingValuationForm';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { BuildingSteps } from 'constants/propertySteps';
import useDraftMarkerSynchronizer from 'features/properties/hooks/useDraftMarkerSynchronizer';
import { useBuildingApi } from '../hooks/useBuildingApi';
import { IFormBuilding } from '../containers/MapSideBarContainer';
import {
  IFinancialYear,
  IFinancial,
  filterEmptyFinancials,
  defaultFinancials,
} from 'features/properties/components/forms/subforms/EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { defaultAddressValues } from 'features/properties/components/forms/subforms/AddressForm';

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

export const defaultBuildingValues: any = {
  id: undefined,
  name: '',
  projectNumber: '',
  description: '',
  address: defaultAddressValues,
  latitude: '',
  longitude: '',
  agencyId: 0,
  parcelId: 0,
  rentableArea: '',
  buildingFloorCount: '',
  buildingConstructionType: undefined,
  buildingConstructionTypeId: '',
  buildingPredominateUse: undefined,
  buildingPredominateUseId: '',
  classificationId: '',
  classification: undefined,
  buildingOccupantType: undefined,
  buildingOccupantTypeId: '',
  transferLeaseOnSale: false,
  occupantName: '',
  leaseExpiry: '',
  buildingTenancy: '',
  evaluations: [],
  fiscals: [],
  financials: defaultFinancials,
};

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
          <OccupancyForm
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
  /** Notify the parent that the building has been saved, potentially starting a new workflow. */
  setBuildingToAssociateLand: (building: IBuilding) => void;
  /** to determine whether certain locked fields can be editable */
  isAdmin?: boolean;
}

/**
 * Do an in place conversion of all values to their expected API equivalents (eg. '' => undefined)
 * @param values the building value to convert.
 */
export const valuesToApiFormat = (values: ISteppedFormValues<IFormBuilding>): IFormBuilding => {
  const apiValues = _.cloneDeep(values);
  const seperatedFinancials = (_.flatten(
    apiValues.data.financials?.map((financial: IFinancialYear) => _.values(financial)),
  ) ?? []) as IFinancial[];
  const allFinancials = filterEmptyFinancials(seperatedFinancials);

  apiValues.data.evaluations = _.filter(allFinancials, financial =>
    Object.keys(EvaluationKeys).includes(financial.key),
  );
  apiValues.data.fiscals = _.filter(allFinancials, financial =>
    Object.keys(FiscalKeys).includes(financial.key),
  );
  apiValues.data.classificationId = +apiValues.data.classificationId;
  apiValues.data.rentableArea = +apiValues.data.rentableArea;
  apiValues.data.buildingFloorCount = +(apiValues.data.buildingFloorCount ?? 0);
  apiValues.data.agencyId = +(apiValues.data.agencyId as any).value;
  if (apiValues.data.leaseExpiry === '') {
    apiValues.data.leaseExpiry = undefined;
  }
  apiValues.data.financials = [];
  return apiValues.data;
};

const BuidingForm: React.FC<IBuildingForm> = ({
  setMovingPinNameSpace,
  nameSpace,
  isAdmin,
  formikRef,
  setBuildingToAssociateLand,
}) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const { createBuilding, updateBuilding } = useBuildingApi();
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', name].filter(x => x).join('.');
    },
    [nameSpace],
  );
  let initialValues = {
    activeStep: 0,
    activeTab: 0,
    data: { ...defaultBuildingValues, agencyId: keycloak.agencyId },
  };

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

          try {
            let building: IBuilding;
            if (!values.data.id) {
              building = await createBuilding(apiValues)(dispatch);
            } else {
              building = await updateBuilding(apiValues)(dispatch);
            }
            setBuildingToAssociateLand(building);
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
