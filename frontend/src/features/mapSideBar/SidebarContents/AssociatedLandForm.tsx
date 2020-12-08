import { ISteppedFormValues, SteppedForm, useFormStepper } from 'components/common/form/StepForm';
import { useFormikContext, yupToFormErrors, getIn, setIn } from 'formik';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import * as API from 'constants/API';
import { IBuilding, IParcel, LeasedLand } from 'actions/parcelsActions';
import { ParcelIdentificationForm } from './subforms/ParcelIdentificationForm';
import { LandUsageForm } from './subforms/LandUsageForm';
import { valuesToApiFormat as landValuesToApiFormat } from './LandForm';
import { LandValuationForm } from './subforms/LandValuationForm';
import { AssociatedLandSteps } from 'constants/propertySteps';
import { LandOwnershipForm } from './subforms/LandOwnershipForm';
import { defaultBuildingValues } from 'features/properties/components/forms/subforms/BuildingForm';
import { getInitialValues as getInitialLandValues } from './LandForm';
import useParcelLayerData from 'features/properties/hooks/useParcelLayerData';
import { AssociatedLandReviewPage } from './subforms/AssociatedLandReviewPage';
import { AssociatedLandSchema } from 'utils/YupSchema';
import { IFormParcel } from 'features/properties/containers/ParcelDetailFormContainer';
import { useDispatch } from 'react-redux';
import { useBuildingApi } from '../hooks/useBuildingApi';
import _ from 'lodash';

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

export interface IAssociatedLand extends IBuilding {
  parcels: IParcel[];
  leasedLandMetadata: ILeasedLand[];
}

export interface ILeasedLand {
  ownershipNote: string;
  type: LeasedLand;
  parcelId?: number;
}
/**
 * Create formiks initialValues by stitching together the default values provided by each subform.
 */
export const getInitialValues = (): IAssociatedLand => {
  return {
    ...defaultBuildingValues,
    leasedLandMetadata: [],
    parcels: [{ ...getInitialLandValues() }],
    leaseExpiry: undefined,
  };
};

/**
 * Do an in place conversion of all values to their expected API equivalents (eg. '' => undefined)
 * @param values the parcel value to convert.
 */
export const valuesToApiFormat = (
  values: ISteppedFormValues<IAssociatedLand>,
  agencyId?: number,
): IAssociatedLand => {
  const apiValues = { ...values };
  const ownedParcels: IParcel[] = getOwnedParcels(
    values.data.leasedLandMetadata,
    values.data.parcels,
  );

  values.data.parcels = ownedParcels.map((p: any) => {
    const parcelApiValues = landValuesToApiFormat({ data: p } as any);
    if (!!agencyId && p.agencyId === '') {
      parcelApiValues.agencyId = agencyId;
    }
    return parcelApiValues;
  });
  return apiValues.data;
};

/**
 * Get the list of parcels stored within formik that are listed as owned.
 * @param leasedLand the array of leased land metadata which tracks which parcels are owned.
 * @param parcels all of the parcels tracked by formik.
 */
const getOwnedParcels = (leasedLand: ILeasedLand[], parcels: IParcel[]): IParcel[] => {
  const ownedParcels: IParcel[] = [];
  leasedLand.forEach((ll: ILeasedLand, index: number) => {
    if (ll.type === LeasedLand.owned) {
      const associatedParcel = parcels[index];
      ll.parcelId = associatedParcel.id === '' ? 0 : associatedParcel.id;
      ownedParcels.push(parcels[index]);
    }
  });
  return ownedParcels;
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
  const formikProps = useFormikContext<ISteppedFormValues<IAssociatedLand>>();

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
            <LandOwnershipForm nameSpace={`data.leasedLandMetadata.${stepper.currentTab}`} />
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
        return <LandValuationForm nameSpace={currentParcelNameSpace} title="Land Valuation" />;
      case AssociatedLandSteps.REVIEW:
        return (
          <AssociatedLandReviewPage
            nameSpace={`data.parcels`}
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
        {stepper.current !== AssociatedLandSteps.REVIEW && (
          <Button
            type="button"
            onClick={() => {
              if (
                getIn(formikProps.values.data, `leasedLandMetadata.${stepper.currentTab}.type`) ===
                LeasedLand.other
              ) {
                stepper.gotoStep(AssociatedLandSteps.REVIEW);
              } else {
                stepper.gotoNext();
              }
            }}
            size="sm"
          >
            Continue
          </Button>
        )}
        {formikProps.dirty &&
          formikProps.isValid &&
          stepper.current === AssociatedLandSteps.REVIEW && (
            <Button size="sm" type="submit">
              Submit
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
  const { createBuilding, updateBuilding } = useBuildingApi();
  const dispatch = useDispatch();
  const api = useApi();
  let initialValues = {
    activeStep: 0,
    activeTab: 0,
    data: getInitialValues(),
  };

  initialValues.data.agencyId = keycloak.agencyId ?? '';

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: ISteppedFormValues<IAssociatedLand>) => {
    let validationValues = _.cloneDeep(values);
    const ownedParcels: IParcel[] = getOwnedParcels(
      validationValues.data.leasedLandMetadata,
      values.data.parcels,
    );
    validationValues.data.parcels = ownedParcels;
    const yupErrors: any = AssociatedLandSchema.validate(validationValues, {
      abortEarly: false,
    }).then(
      () => ({}),
      (err: any) => yupToFormErrors(err),
    );
    let errors = await yupErrors;
    await ownedParcels.forEach(async (p: any, index: number) => {
      let pidDuplicated = false;
      if (p.pid && getIn(initialValues.data, `parcels.${index}.pid`) !== p.pid) {
        pidDuplicated = !(await isPidAvailable(p));
      }

      let pinDuplicated = false;
      if (
        p.pin &&
        getIn(initialValues.data, `parcels.${index}.pin`) !== p.pin &&
        p.pin.toString().length < 10
      ) {
        pinDuplicated = !(await isPinAvailable(p));
      }

      let parcelErrors = getIn(errors, `parcels.${index}`) || {};
      if (!parcelErrors) {
        setIn(errors, `parcels.${index}`, parcelErrors);
      }
      if (pidDuplicated) {
        parcelErrors = { ...parcelErrors, pid: 'This PID is already in use.' };
      }
      if (pinDuplicated) {
        parcelErrors = { ...parcelErrors, pin: 'This PIN is already in use.' };
      }
      if (Object.keys(parcelErrors).length) {
        errors = setIn(errors, `data.parcels.${index}`, parcelErrors);
      }
    });
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

  return (
    <Container className="landForm">
      <SteppedForm<IAssociatedLand>
        // Provide the steps
        steps={[
          { route: 'ownership', title: 'Land Ownership', completed: false, canGoToStep: true },
          { route: 'identification', title: 'Parcel ID', completed: false, canGoToStep: true },
          { route: 'usage', title: 'Usage', completed: false, canGoToStep: true },
          { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
          { route: 'review', title: 'Review', completed: false, canGoToStep: true },
        ]}
        getTabs={(values: IAssociatedLand) => {
          return values.parcels.map((p: any, index: number) => {
            return p.name?.length ? p.name : `Parcel ${index + 1}`;
          });
        }}
        persistable={true}
        persistProps={{
          name: 'land',
          secret: keycloak.obj.subject,
          persistCallback: noop,
        }}
        onAddTab={(values: IAssociatedLand) => {
          if (values.parcels !== undefined) {
            values.parcels.push(getInitialLandValues());
          }
        }}
        onRemoveTab={(values: IAssociatedLand, tabIndex: number) => {
          if (values?.parcels.length > tabIndex) {
            values.parcels.splice(tabIndex, 1);
          }
        }}
        initialValues={initialValues}
        validate={handleValidate}
        formikRef={props.formikRef}
        onSubmit={async (values, actions) => {
          const apiValues = valuesToApiFormat(_.cloneDeep(values), keycloak.agencyId);
          try {
            if (!values.data.id) {
              await createBuilding(apiValues)(dispatch);
            } else {
              await updateBuilding(apiValues)(dispatch);
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
