import {
  SteppedForm,
  useFormStepper,
  ISteppedFormValues,
  IStepperTab,
} from 'components/common/form/StepForm';
import { useFormikContext, yupToFormErrors } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import * as API from 'constants/API';
import { IBuilding } from 'actions/parcelsActions';
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
import { BuildingForm } from '.';
import TooltipWrapper from 'components/common/TooltipWrapper';
import {
  BuildingSchema,
  OccupancySchema,
  ValuationSchema,
  BuildingInformationSchema,
} from 'utils/YupSchema';
import { AssociatedLandListForm } from './subforms/AssociatedLandListForm';
import { stringToNull } from 'utils';
import useParcelLayerData from 'features/properties/hooks/useParcelLayerData';

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
  totalArea: '',
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
  buildingTenancyUpdatedOn: '',
  evaluations: [],
  fiscals: [],
  financials: defaultFinancials,
};

/**
 * A component used for submitting standalone buildings or buildings grouped with land.
 * This form will appear after selecting 'Add Building' after navigating to Manage Property > Submit Property in PIMS
 * @component
 */

const Form: React.FC<IBuildingForm> = ({
  isPropertyAdmin,
  setMovingPinNameSpace,
  nameSpace,
  disabled,
  goToAssociatedLand,
  formikRef,
}) => {
  const stepper = useFormStepper();
  useDraftMarkerSynchronizer('data');
  const formikProps = useFormikContext<ISteppedFormValues<IFormBuilding>>();
  useParcelLayerData({
    formikRef,
    nameSpace: 'data',
    agencyId: +(formikProps.values.data.agencyId as any)?.value
      ? +(formikProps.values.data.agencyId as any).value
      : +formikProps.values.data.agencyId,
  });
  const { getOptionsByType } = useCodeLookups();
  const isViewOrUpdate = !!formikProps.values?.data?.id;

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
              isPropertyAdmin={isPropertyAdmin}
              disabled={disabled}
            />
          </div>
        );
      case BuildingSteps.TENANCY:
        return (
          <OccupancyForm formikProps={formikProps} nameSpace={nameSpace} disabled={disabled} />
        );
      case BuildingSteps.VALUATION:
        return (
          <BuildingValuationForm
            nameSpace={nameSpace}
            formikProps={formikProps}
            disabled={disabled}
          />
        );
      case BuildingSteps.ASSOCIATED:
        return <AssociatedLandListForm title="View Associated Land" nameSpace="data" />;
      case BuildingSteps.REVIEW:
        return (
          <BuildingReviewPage
            classifications={classifications}
            agencies={agencies}
            occupantTypes={occupancyType}
            predominateUses={predominateUses}
            constructionType={constructionType}
            nameSpace={nameSpace}
            disabled={disabled}
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
        {!stepper.isSubmit(stepper.current) && (
          <Button style={{ marginRight: 10 }} size="sm" onClick={() => stepper.gotoNext()}>
            Continue
          </Button>
        )}
        {formikProps.dirty && stepper.isSubmit(stepper.current) && !disabled && (
          <>
            {isViewOrUpdate ? (
              <>
                <TooltipWrapper
                  toolTipId="modify-associated-land-tooltip"
                  toolTip="Add/Remove or Edit land associated to this building"
                >
                  <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={() => goToAssociatedLand(formikProps.values.data)}
                  >
                    Modify Associated Land
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper
                  toolTipId="submit-building-to-inventory-tooltip"
                  toolTip="Save any changes you've made"
                >
                  <Button type="submit">Save Updates</Button>
                </TooltipWrapper>
              </>
            ) : (
              <Button type="submit">Submit to Inventory</Button>
            )}
          </>
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
  /** Go to the associated land form directly */
  goToAssociatedLand: (building: IBuilding) => void;
  /** to determine whether certain locked fields can be editable */
  isPropertyAdmin?: boolean;
  /** whether this form can be interacted with */
  disabled?: boolean;
}

interface IParentBuildingForm extends IBuildingForm {
  /** the initial values of this form, as loaded from the api */
  initialValues?: IFormBuilding;
  /** Notify the parent that the building has been saved, potentially starting a new workflow. */
  setBuildingToAssociateLand: (building: IBuilding) => void;
}

/**
 * A wrapper around the landform that provides all expected props for the landform to be used in read-only mode.
 * This sets all the fields to disabled and disables all actions triggered by interacting with the forms.
 * It also disables form validation and submission.
 * @component
 */
export const ViewOnlyBuildingForm: React.FC<Partial<IParentBuildingForm>> = (props: {
  formikRef?: any;
  initialValues?: IFormBuilding;
}) => {
  return (
    <BuildingForm
      setMovingPinNameSpace={noop}
      goToAssociatedLand={noop}
      formikRef={props.formikRef}
      isPropertyAdmin={false}
      setBuildingToAssociateLand={noop}
      initialValues={props.initialValues ?? ({} as any)}
      disabled={true}
      nameSpace="data"
    />
  );
};

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
  apiValues.data.buildingOccupantTypeId = undefined as any;
  apiValues.data.rentableArea = +apiValues.data.rentableArea;
  apiValues.data.buildingFloorCount = +(apiValues.data.buildingFloorCount ?? 0);
  apiValues.data.agencyId = +values.data.agencyId;
  apiValues.data.leaseExpiry = stringToNull(apiValues.data.leaseExpiry);
  apiValues.data.financials = [];
  apiValues.data.buildingTenancyUpdatedOn = stringToNull(apiValues.data.buildingTenancyUpdatedOn);
  return apiValues.data;
};

const BuidingForm: React.FC<IParentBuildingForm> = ({
  setMovingPinNameSpace,
  nameSpace,
  isPropertyAdmin,
  formikRef,
  setBuildingToAssociateLand,
  goToAssociatedLand,
  disabled,
  ...rest
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
  const initialValues = {
    activeStep: 0,
    activeTab: 0,
    data: { ...defaultBuildingValues, agencyId: keycloak.agencyId, ...rest.initialValues },
  };
  const isViewOrUpdate = !!initialValues?.data?.id;

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: ISteppedFormValues<IFormBuilding>) => {
    const yupErrors: any = BuildingSchema.validate(values.data, { abortEarly: false }).then(
      () => ({}),
      (err: any) => yupToFormErrors(err),
    );

    let errors = await yupErrors;
    return Object.keys(errors).length ? Promise.resolve({ data: errors }) : Promise.resolve({});
  };

  return (
    <Container className="buildingForm">
      <SteppedForm
        // Provide the steps
        steps={[
          {
            route: 'building-id',
            title: 'Building Info',
            completed: false,
            canGoToStep: true,
            validation: disabled
              ? undefined
              : { schema: BuildingInformationSchema, nameSpace: () => 'data' },
          },
          {
            route: 'tenancy',
            title: 'Occupancy',
            completed: false,
            canGoToStep: isViewOrUpdate || !!disabled,
            validation: disabled ? undefined : { schema: OccupancySchema, nameSpace: () => 'data' },
          },
          {
            route: 'valuation',
            title: 'Valuation',
            completed: false,
            canGoToStep: isViewOrUpdate || !!disabled,
            validation: disabled ? undefined : { schema: ValuationSchema, nameSpace: () => 'data' },
          },
          {
            route: 'associated',
            title: 'Associated Land',
            completed: false,
            canGoToStep: isViewOrUpdate || !!disabled,
          },
          {
            route: 'review',
            title: 'Review & Submit',
            completed: false,
            canGoToStep: isViewOrUpdate || !!disabled,
            validation: disabled ? undefined : { schema: BuildingSchema, nameSpace: () => 'data' },
          },
        ]}
        persistable={!disabled}
        persistProps={{
          name: isViewOrUpdate ? 'updated-building' : 'building',
          secret: keycloak.obj.subject,
          persistCallback: (values: ISteppedFormValues<IFormBuilding>) => {
            const newValues: ISteppedFormValues<IFormBuilding> = {
              ...values,
              activeStep: 0,
              activeTab: 0,
            };
            newValues.tabs?.forEach((t: IStepperTab) => (t.activeStep = 0));
            formikRef.current.resetForm({ values: newValues });
          },
        }}
        // provide initial building props
        initialValues={initialValues}
        formikRef={formikRef}
        validate={handleValidate}
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
            actions.resetForm({ values: { ...values, ...{ data: building as any } } });
            setBuildingToAssociateLand(building);
          } catch (error) {
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        <Form
          isPropertyAdmin={isPropertyAdmin}
          setMovingPinNameSpace={setMovingPinNameSpace}
          nameSpace={withNameSpace('')}
          disabled={disabled}
          goToAssociatedLand={goToAssociatedLand}
          formikRef={formikRef}
        />
      </SteppedForm>
    </Container>
  );
};

export default BuidingForm;
