import {
  ISteppedFormValues,
  SteppedForm,
  useFormStepper,
  IStepperTab,
} from 'components/common/form/StepForm';
import { defaultInformationFormValues } from 'features/properties/components/forms/subforms/InformationForm';
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
import { defaultAddressValues } from 'features/properties/components/forms/subforms/AddressForm';
import { ParcelIdentificationForm } from './subforms/ParcelIdentificationForm';
import { LandUsageForm } from './subforms/LandUsageForm';
import { LandReviewPage } from './subforms/LandReviewPage';
import { defaultPidPinFormValues } from 'features/properties/components/forms/subforms/PidPinForm';
import { defaultLandValues } from 'features/properties/components/forms/subforms/LandForm';
import {
  defaultFinancials,
  filterEmptyFinancials,
  IFinancial,
  IFinancialYear,
} from 'features/properties/components/forms/subforms/EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import {
  ParcelSchema,
  LandIdentificationSchema,
  LandUsageSchema,
  ValuationSchema,
} from 'utils/YupSchema';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { LandValuationForm } from './subforms/LandValuationForm';
import { LandSteps } from 'constants/propertySteps';
import useDraftMarkerSynchronizer from 'features/properties/hooks/useDraftMarkerSynchronizer';
import { IFormParcel } from '../containers/MapSideBarContainer';
import useParcelLayerData from 'features/properties/hooks/useParcelLayerData';
import { IStep } from 'components/common/Stepper';
import { AssociatedBuildingListForm } from './subforms/AssociatedBuildingListForm';
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
 * Create formiks initialValues by stitching together the default values provided by each subform.
 */
export const getInitialValues = (): any => {
  return {
    ...defaultPidPinFormValues,
    ...defaultLandValues,
    ...defaultInformationFormValues,
    latitude: '',
    longitude: '',
    address: defaultAddressValues,
    buildings: [],
    financials: defaultFinancials,
    searchPid: '',
    searchPin: '',
    searchAddress: '',
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
  values.data.agencyId = +values.data.agencyId;
  return values.data;
};

const Form: React.FC<ILandForm> = ({
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  formikRef,
  isPropertyAdmin,
  initialValues,
  disabled,
}) => {
  // access the stepper to later split the form into segments
  const stepper = useFormStepper();
  const formikProps = useFormikContext<ISteppedFormValues<IFormParcel>>();
  useParcelLayerData({
    formikRef,
    nameSpace: 'data',
    agencyId: +(formikProps.values.data.agencyId as any)?.value
      ? +(formikProps.values.data.agencyId as any).value
      : +formikProps.values.data.agencyId,
  });
  const isViewOrUpdate = !!initialValues.id;
  const isBareLand = !initialValues?.buildings?.length;

  // lookup codes that will be used by subforms
  const { getOptionsByType } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
  useDraftMarkerSynchronizer('data');

  const render = (): React.ReactNode => {
    switch (stepper.current) {
      case LandSteps.IDENTIFICATION:
        return (
          <div className="parcel-identification">
            <ParcelIdentificationForm
              agencies={agencies}
              classifications={classifications}
              handleGeocoderChanges={handleGeocoderChanges}
              setMovingPinNameSpace={setMovingPinNameSpace}
              handlePidChange={handlePidChange}
              handlePinChange={handlePinChange}
              isPropertyAdmin={isPropertyAdmin}
              nameSpace="data"
              isViewOrUpdate={isViewOrUpdate}
              disabled={disabled}
            />
          </div>
        );
      case LandSteps.USAGE:
        return (
          <div className="parcel-usage">
            <LandUsageForm
              classifications={classifications}
              nameSpace="data"
              {...formikProps}
              disabled={disabled}
            />
          </div>
        );
      case LandSteps.VALUATION:
        return (
          <LandValuationForm title="Bare Land Valuation" nameSpace="data" disabled={disabled} />
        );
      case LandSteps.ASSOCIATED_OR_REVIEW:
        return !isBareLand ? (
          <AssociatedBuildingListForm title="View Associated Buildings" nameSpace="data" />
        ) : (
          <LandReviewPage
            classifications={classifications}
            agencies={agencies}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            nameSpace="data"
            disabled={disabled}
          />
        );
      case LandSteps.REVIEW:
        return (
          <LandReviewPage
            classifications={classifications}
            agencies={agencies}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            nameSpace="data"
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
        {formikProps.dirty &&
          formikProps.isValid &&
          !disabled &&
          stepper.isSubmit(stepper.current) && (
            <Button size="sm" type="submit">
              Submit
            </Button>
          )}
      </FormFooter>
    </FormContentWrapper>
  );
};

interface ILandForm {
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
  /** whether or not this user has property admin priviledges */
  isPropertyAdmin: boolean;
  /** initial values used to populate this form */
  initialValues: IFormParcel;
  /** whether this form can be interacted with */
  disabled?: boolean;
}

interface IParentLandForm extends ILandForm {
  /** signal the parent that the land creation process has been completed. */
  setLandComplete: (show: boolean) => void;
  /** signal the parent that the land update process has been completed. */
  setLandUpdateComplete: (show: boolean) => void;
}

/**
 * A wrapper around the landform that provides all expected props for the landform to be used in read-only mode.
 * This sets all the fields to disabled and disables all actions triggered by interacting with the forms.
 * It also disables form validation and submission.
 * @component
 */
export const ViewOnlyLandForm: React.FC<Partial<IParentLandForm>> = (props: {
  formikRef?: any;
  initialValues?: IFormParcel;
}) => {
  return (
    <LandForm
      setMovingPinNameSpace={noop}
      formikRef={props.formikRef}
      handleGeocoderChanges={async (response: IGeocoderResponse) => {}}
      handlePidChange={noop}
      handlePinChange={noop}
      isPropertyAdmin={false}
      setLandComplete={noop}
      setLandUpdateComplete={noop}
      initialValues={props.initialValues ?? ({} as any)}
      disabled={true}
    />
  );
};

/**
 * A component used for submitting bare land.
 * This form will appear after selecting 'Add Bare Land' after navigating to Manage Property > Submit Property in PIMS
 * @component
 */
const LandForm: React.FC<IParentLandForm> = (props: IParentLandForm) => {
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const api = useApi();
  const initialValues = {
    activeStep: 0,
    activeTab: 0,
    tabs: [{ activeStep: 0 }],
    data: { ...getInitialValues(), ...props.initialValues },
  };
  const isViewOrUpdate = !!initialValues?.data?.id;

  initialValues.data.agencyId = keycloak.agencyId ?? '';

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
    if (values.data.pid && initialValues.data.pid !== values.data.pid && !values.data.id) {
      pidDuplicated = !(await isPidAvailable(values.data));
    }

    let pinDuplicated = false;
    if (
      values.data.pin &&
      initialValues.data.pin !== values.data.pin &&
      values.data.pin.toString().length < 10 &&
      !values.data.id
    ) {
      pinDuplicated = !(await isPinAvailable(values.data));
    }

    let errors = await yupErrors;
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    if (pinDuplicated) {
      errors = { ...errors, pin: 'This PIN is already in use.' };
    }
    return Object.keys(errors).length ? Promise.resolve({ data: errors }) : Promise.resolve({});
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPinAvailable(values.id, values.pin);
    return response?.available;
  };

  const steps: IStep[] = [
    {
      route: 'identification',
      title: 'Parcel ID',
      completed: false,
      canGoToStep: true,
      validation: props.disabled
        ? undefined
        : { schema: LandIdentificationSchema, nameSpace: () => 'data' },
    },
    {
      route: 'usage',
      title: 'Usage',
      completed: false,
      canGoToStep: !!initialValues?.data?.id || !!props.disabled,
      validation: props.disabled ? undefined : { schema: LandUsageSchema, nameSpace: () => 'data' },
    },
    {
      route: 'valuation',
      title: 'Valuation',
      completed: false,
      canGoToStep: !!initialValues?.data?.id || !!props.disabled,
      validation: props.disabled ? undefined : { schema: ValuationSchema, nameSpace: () => 'data' },
    },
  ];

  if (!!props.initialValues?.buildings?.length) {
    steps.push({
      route: 'associatedLand',
      title: 'View Buildings',
      completed: false,
      canGoToStep: !!initialValues?.data?.id || !!props.disabled,
    });
  }
  steps.push({
    route: 'review',
    title: 'Review',
    completed: false,
    canGoToStep: !!initialValues?.data?.id || !!props.disabled,
    validation: props.disabled ? undefined : { schema: ParcelSchema, nameSpace: () => 'data' },
  });

  return (
    <Container className="landForm">
      <SteppedForm
        // Provide the steps
        steps={steps}
        persistable={!props.disabled}
        persistProps={{
          name: isViewOrUpdate ? 'update-land' : 'land',
          secret: keycloak.obj.subject,
          persistCallback: (values: ISteppedFormValues<IFormParcel>) => {
            const newValues: ISteppedFormValues<IFormParcel> = {
              ...values,
              activeStep: 0,
              activeTab: 0,
            };
            newValues.tabs?.forEach((t: IStepperTab) => (t.activeStep = 0));
            props.formikRef.current.resetForm({ values: newValues });
          },
        }}
        initialValues={initialValues}
        validate={handleValidate}
        formikRef={props.formikRef}
        onSubmit={async (values, actions) => {
          const apiValues = valuesToApiFormat(_.cloneDeep(values));
          let response;
          try {
            if (!values.data.id) {
              response = await createParcel(apiValues)(dispatch);
              props.setLandComplete(true);
            } else {
              response = await updateParcel(apiValues)(dispatch);
              props.setLandUpdateComplete(true);
            }
            actions.resetForm({ values: { ...values, data: response as any } });
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
          isPropertyAdmin={props.isPropertyAdmin}
          formikRef={props.formikRef}
          initialValues={initialValues.data}
          disabled={props.disabled}
        />
      </SteppedForm>
    </Container>
  );
};
export default LandForm;
