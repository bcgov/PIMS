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
  filterEmptyFinancials,
  getMergedFinancials,
} from 'features/properties/components/forms/subforms/EvaluationForm';
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
import useParcelLayerData from 'features/properties/hooks/useParcelLayerData';
import { IStep } from 'components/common/Stepper';
import DebouncedValidation from 'features/properties/components/forms/subforms/DebouncedValidation';
import { IParcel } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { stringToNull } from 'utils';
import variables from '_variables.module.scss';
import LastUpdatedBy from 'features/properties/components/LastUpdatedBy';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { PropertyTypes } from 'constants/index';

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
  margin-bottom: 70px;
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
  background-color: ${variables.filterBackgroundColor};
  bottom: 40px;
`;

const FillRemainingSpace = styled.span`
  flex: 1 1 auto;
`;

export interface ISearchFields {
  searchPid: string;
  searchPin: string;
  searchAddress: string;
  searchParentPid: string;
}

/**
 * Create formiks initialValues by stitching together the default values provided by each subform.
 */
export const getInitialValues = (): IParcel & ISearchFields => {
  return {
    ...defaultPidPinFormValues,
    ...defaultLandValues,
    ...defaultInformationFormValues,
    latitude: '',
    longitude: '',
    address: defaultAddressValues,
    buildings: [],
    searchPid: '',
    searchPin: '',
    searchAddress: '',
    searchParentPid: '',
    encumbranceReason: '',
    assessedBuilding: '',
    assessedLand: '',
    evaluations: getMergedFinancials([], Object.values(EvaluationKeys)),
    fiscals: getMergedFinancials([], Object.values(FiscalKeys)),
    id: '',
    parcels: [],
  };
};

/**
 * Do an in place conversion of all values to their expected API equivalents (eg. '' => undefined)
 * @param values the parcel value to convert.
 */
export const valuesToApiFormat = (values: ISteppedFormValues<IParcel>): IParcel => {
  const apiValues = _.cloneDeep(values);
  apiValues.data.pin = apiValues?.data.pin ? +apiValues.data.pin : undefined;
  apiValues.data.pid = apiValues?.data.pid ? apiValues.data.pid : undefined;
  apiValues.data.evaluations = filterEmptyFinancials(apiValues.data.evaluations);
  apiValues.data.fiscals = filterEmptyFinancials(apiValues.data.fiscals);
  apiValues.data.landArea = +apiValues.data.landArea;
  apiValues.data.agencyId = +apiValues.data.agencyId;
  apiValues.data.id = stringToNull(apiValues.data.id);
  return apiValues.data;
};

/**
 * A component used for submitting standalone land.
 * This form will appear after selecting 'Add LAnd' after navigating to Manage Property > Submit Property in PIMS
 * @component
 */
const Form: React.FC<ILandForm> = ({
  handleGeocoderChanges,
  setMovingPinNameSpace,
  handlePidChange,
  handlePinChange,
  findMatchingPid,
  formikRef,
  isPropertyAdmin,
  initialValues,
  disabled,
}) => {
  // access the stepper to later split the form into segments
  const stepper = useFormStepper();
  const formikProps = useFormikContext<ISteppedFormValues<IParcel>>();
  //if the pid is set externally, we must update the touched to reflect this for errors to display correctly.
  useDeepCompareEffect(() => {
    if (!!formikProps.values.data.pid) {
      formikProps.setFieldTouched('data.pid', true);
    }
    if (!!formikProps.values.data.pin) {
      formikProps.setFieldTouched('data.pin', true);
    }
  }, [formikProps.values.data.pid, formikProps.values.data.pin]);
  useParcelLayerData({
    formikRef,
    nameSpace: 'data',
    agencyId: +(formikProps.values.data.agencyId as any)?.value
      ? +(formikProps.values.data.agencyId as any).value
      : +formikProps.values.data.agencyId,
  });
  const isViewOrUpdate = !!initialValues.id;

  // lookup codes that will be used by subforms
  const { getOptionsByType, getPropertyClassificationOptions } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getPropertyClassificationOptions();
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
              findMatchingPid={findMatchingPid}
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
          <LandValuationForm
            title="Land Valuation"
            nameSpace="data"
            disabled={disabled}
            showImprovements={!!formikProps.values.data.buildings.length}
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
            isPropertyAdmin={isPropertyAdmin}
          />
        );
    }
  };
  return (
    <FormContentWrapper>
      <DebouncedValidation formikProps={formikProps}></DebouncedValidation>
      <FormContent>{render()}</FormContent>
      <FormFooter>
        <InventoryPolicy />
        <LastUpdatedBy
          createdOn={initialValues?.createdOn}
          updatedOn={initialValues?.updatedOn}
          updatedByName={initialValues?.updatedByName}
          updatedByEmail={initialValues?.updatedByEmail}
        />
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
  setMovingPinNameSpace: (nameSpace?: string) => void;
  /** to autopopulate fields based on Geocoder information */
  handlePidChange: (pid: string) => void;
  /** help with formatting of the pin */
  handlePinChange: (pin: string) => void;
  /** Function that searches for a parcel matching a pid within the API */
  findMatchingPid: (pid: string, nameSpace?: string | undefined) => Promise<IParcel | undefined>;
  /** whether or not this user has property admin priviledges */
  isPropertyAdmin: boolean;
  /** initial values used to populate this form */
  initialValues: IParcel;
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
  initialValues?: IParcel;
}) => {
  return (
    <LandForm
      setMovingPinNameSpace={noop}
      formikRef={props.formikRef}
      handleGeocoderChanges={async () => {}}
      handlePidChange={noop}
      handlePinChange={noop}
      isPropertyAdmin={false}
      setLandComplete={noop}
      setLandUpdateComplete={noop}
      initialValues={props.initialValues ?? ({} as any)}
      disabled={true}
      findMatchingPid={noop as any}
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
    data: {
      ...getInitialValues(),
      ...props.initialValues,
      evaluations: getMergedFinancials(
        props.initialValues?.evaluations ?? [],
        Object.values(EvaluationKeys),
      ),
      fiscals: getMergedFinancials(props.initialValues?.fiscals ?? [], Object.values(FiscalKeys)),
    },
  };
  const isViewOrUpdate = !!initialValues?.data?.id;
  initialValues.data.agencyId = initialValues.data.agencyId
    ? initialValues.data.agencyId
    : keycloak.agencyId ?? '';

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: ISteppedFormValues<IParcel>) => {
    const yupErrors: any = ParcelSchema.validate(values.data, { abortEarly: false }).then(
      () => ({}),
      (err: any) => yupToFormErrors(err),
    );

    let pidDuplicated = false;
    if (
      values.data.pid &&
      initialValues.data.pid !== values.data.pid &&
      !values.data.id &&
      values.data.propertyTypeId !== PropertyTypes.SUBDIVISION
    ) {
      pidDuplicated = !(await isPidAvailable(values.data));
    }

    let pinDuplicated = false;
    if (
      values.data.pin &&
      initialValues.data.pin !== values.data.pin &&
      values.data.pin.toString().length < 10 &&
      !values.data.id &&
      values.data.propertyTypeId !== PropertyTypes.SUBDIVISION
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

  const isPidAvailable = async (values: IParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IParcel): Promise<boolean> => {
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
          persistCallback: (values: ISteppedFormValues<IParcel>) => {
            const newValues: ISteppedFormValues<IParcel> = {
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
        validateOnBlur={true}
        validateOnChange={false}
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
          findMatchingPid={props.findMatchingPid}
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
