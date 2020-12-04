import { ISteppedFormValues, SteppedForm, useFormStepper } from 'components/common/form/StepForm';
import { useFormikContext, yupToFormErrors } from 'formik';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import * as API from 'constants/API';
import { IBuilding } from 'actions/parcelsActions';
import { ParcelDetailTabs } from 'features/properties/containers/ParcelDetailContainer';
import { ParcelIdentificationForm } from './subforms/ParcelIdentificationForm';
import { LandUsageForm } from './subforms/LandUsageForm';
import { LandReviewPage } from './subforms/LandReviewPage';
import {
  filterEmptyFinancials,
  IFinancial,
  IFinancialYear,
} from 'features/properties/components/forms/subforms/EvaluationForm';
import { IFormParcel } from 'features/properties/containers/ParcelDetailFormContainer';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { ParcelSchema } from 'utils/YupSchema';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { LandValuationForm } from './subforms/LandValuationForm';
import { AssociatedLandSteps } from 'constants/propertySteps';
import { LandOwnershipForm } from './subforms/LandOwnershipForm';
import { defaultBuildingValues } from 'features/properties/components/forms/subforms/BuildingForm';
import { getInitialValues as getInitialLandValues } from './LandForm';
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
`;

const FillRemainingSpace = styled.span`
  flex: 1 1 auto;
`;

/**
 * Create formiks initialValues by stitching together the default values provided by each subform.
 */
export const getInitialValues = (): any => {
  return {
    ...defaultBuildingValues,
    parcels: [{ ...getInitialLandValues() }],
  };
};

/**
 * Do an in place conversion of all values to their expected API equivalents (eg. '' => undefined)
 * @param values the parcel value to convert.
 */
export const valuesToApiFormat = (values: ISteppedFormValues<IFormParcel>): IFormParcel => {
  values.data.pin = values?.data.pin ? values.data.pin : undefined;
  values.data.pid = values?.data.pid ? values.data.pid : undefined;
  const seperatedFinancials = (_.flatten(
    values.data.financials?.map((financial: IFinancialYear) => _.values(financial)),
  ) ?? []) as IFinancial[];
  const allFinancials = filterEmptyFinancials(seperatedFinancials);

  values.data.evaluations = _.filter(allFinancials, financial =>
    Object.keys(EvaluationKeys).includes(financial.key),
  );
  values.data.fiscals = _.filter(allFinancials, financial =>
    Object.keys(FiscalKeys).includes(financial.key),
  );
  values.data.landArea = +values.data.landArea;
  values.data.financials = [];
  return values.data;
};

const Form: React.FC<IAssociatedLandForm> = ({
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  formikRef,
}) => {
  // access the stepper to later split the form into segments
  const stepper = useFormStepper();
  const formikProps = useFormikContext<IBuilding>();

  // lookup codes that will be used by subforms
  const { getOptionsByType } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
  const currentParcelNameSpace = `data.parcels.${stepper.currentTab}`;
  useParcelLayerData({ formikRef, nameSpace: currentParcelNameSpace });

  const render = (): React.ReactNode => {
    switch (stepper.current) {
      case AssociatedLandSteps.LAND_OWNERSHIP:
        return (
          <div className="land-ownership">
            <LandOwnershipForm
              nameSpace={currentParcelNameSpace}
              setMovingPinNameSpace={setMovingPinNameSpace}
              handleGeocoderChanges={handleGeocoderChanges}
              handlePidChange={handlePidChange}
            />
          </div>
        );
      case AssociatedLandSteps.IDENTIFICATION:
        return (
          <div className="parcel-identification">
            <ParcelIdentificationForm
              nameSpace={currentParcelNameSpace}
              agencies={agencies}
              classifications={classifications}
              handleGeocoderChanges={handleGeocoderChanges}
              setMovingPinNameSpace={setMovingPinNameSpace}
              handlePidChange={handlePidChange}
              handlePinChange={handlePinChange}
            />
          </div>
        );
      case AssociatedLandSteps.USAGE:
        return (
          <div className="parcel-usage">
            <LandUsageForm
              classifications={classifications}
              nameSpace={currentParcelNameSpace}
              {...formikProps}
            />
          </div>
        );
      case AssociatedLandSteps.VALUATION:
        return <LandValuationForm nameSpace={currentParcelNameSpace} />;
      case AssociatedLandSteps.REVIEW:
        return (
          <LandReviewPage
            nameSpace={`data`}
            classifications={classifications}
            agencies={agencies}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
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
          <Button
            type="button"
            onClick={() => {
              stepper.gotoNext();
            }}
            size="sm"
          >
            Continue
          </Button>
        )}
        {formikProps.dirty && formikProps.isValid && stepper.current === 3 && (
          <Button size="sm" type="submit">
            Submit Raw Land
          </Button>
        )}
      </FormFooter>
    </FormContentWrapper>
  );
};

interface IAssociatedLandForm {
  /** pass the formikRef on to other components */
  formikRef?: any;
  /** to autopopulate fields based on Geocoder information */
  handleGeocoderChanges: (data: IGeocoderResponse) => Promise<void>;
  /** to change the user's cursor when adding a marker */
  setMovingPinNameSpace: (nameSpace: string) => void;
  /** to autopopulate fields based on Geocoder information */
  handlePidChange: (pid: string) => void;
  /** help with formatting of the pin */
  handlePinChange: (pin: string) => void;
}

/**
 * A component used for land associated to a building.
 * This form will appear after a user enters a new building after navigating to Manage Property > Submit Property in PIMS
 * @component
 */

const AssociatedLandForm: React.FC<IAssociatedLandForm> = (props: IAssociatedLandForm) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const api = useApi();
  let initialValues = {
    activeStep: 0,
    activeTab: 0,
    data: getInitialValues(),
  };

  initialValues.data.agencyId = keycloak.agencyId;

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: ISteppedFormValues<IFormParcel>) => {
    const yupErrors: any = ParcelSchema.validate(values.data, { abortEarly: false }).then(
      () => ({}),
      (err: any) => yupToFormErrors(err),
    );

    let pidDuplicated = false;
    if (values.data.pid && initialValues.data.pid !== values.data.pid) {
      pidDuplicated = !(await isPidAvailable(values.data));
    }

    let pinDuplicated = false;
    if (
      values.data.pin &&
      initialValues.data.pin !== values.data.pin &&
      values.data.pin.toString().length < 10
    ) {
      pinDuplicated = !(await isPinAvailable(values.data));
    }

    let errors = await yupErrors;
    const { buildings: buildingErrors, tabs, ...parcelErrors } = errors;
    if (buildingErrors?.length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.buildings] };
    }
    if (parcelErrors && Object.keys(parcelErrors).length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.parcel] };
    }
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    if (pinDuplicated) {
      errors = { ...errors, pin: 'This PIN is already in use.' };
    }
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPinAvailable(values.id, values.pin);
    return response?.available;
  };
  const formikParcels = props.formikRef?.current?.values?.data?.parcels;

  return (
    <Container className="landForm">
      <SteppedForm
        // Provide the steps
        steps={[
          { route: 'ownership', title: 'Land Ownership', completed: false, canGoToStep: true },
          { route: 'identification', title: 'Parcel ID', completed: false, canGoToStep: true },
          { route: 'usage', title: 'Usage', completed: false, canGoToStep: true },
          { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
          { route: 'review', title: 'Review', completed: false, canGoToStep: true },
        ]}
        getTabs={() => {
          return (formikParcels ?? initialValues.data.parcels).map((p: any, index: number) =>
            p.name?.length ? p.name : `Parcel ${index + 1}`,
          );
        }}
        persistable={true}
        persistProps={{
          name: 'land',
          secret: keycloak.obj.subject,
          persistCallback: noop,
        }}
        onAddTab={() => {
          if (formikParcels !== undefined) {
            formikParcels.push(getInitialLandValues());
          }
        }}
        onRemoveTab={(tabIndex: number) => {
          if (formikParcels?.length > tabIndex) {
            formikParcels.splice(tabIndex, 1);
          }
        }}
        initialValues={initialValues}
        validate={handleValidate}
        formikRef={props.formikRef}
        onSubmit={async (values, actions) => {
          const apiValues = valuesToApiFormat(_.cloneDeep(values));
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
          setMovingPinNameSpace={props.setMovingPinNameSpace}
          handleGeocoderChanges={props.handleGeocoderChanges}
          handlePidChange={props.handlePidChange}
          handlePinChange={props.handlePinChange}
          formikRef={props.formikRef}
        />
      </SteppedForm>
    </Container>
  );
};
export default AssociatedLandForm;
