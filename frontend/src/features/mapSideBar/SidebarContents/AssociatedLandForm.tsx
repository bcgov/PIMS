import { ISteppedFormValues, SteppedForm, useFormStepper } from 'components/common/form/StepForm';
import { useFormikContext, yupToFormErrors, getIn, setIn } from 'formik';
import { IGeocoderResponse, useApi } from 'hooks/useApi';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { noop } from 'lodash';
import * as React from 'react';
import { Button, Form as BSForm } from 'react-bootstrap';
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
import { getInitialValues as getInitialLandValues } from './LandForm';
import useParcelLayerData from 'features/properties/hooks/useParcelLayerData';
import { AssociatedLandReviewPage } from './subforms/AssociatedLandReviewPage';
import {
  AssociatedLandSchema,
  AssociatedLandOwnershipSchema,
  LandIdentificationSchema,
  LandUsageSchema,
  LandValuationSchema,
} from 'utils/YupSchema';
import { useDispatch } from 'react-redux';
import { useBuildingApi } from '../hooks/useBuildingApi';
import _ from 'lodash';
import { IFormParcel } from '../containers/MapSideBarContainer';
import { useState } from 'react';
import { defaultBuildingValues } from './BuildingForm';

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
  bottom: 30px;
`;

const FillRemainingSpace = styled.span`
  flex: 1 1 auto;
`;

const PreAssociateSteps = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 50px;
  span {
    display: flex;
    align-items: center;
  }
  p {
    border-radius: 25px;
    border: 1px solid black;
    height: 25px;
    width: 25px;
    display: block;
    margin: 0px 5px;
  }
  select {
    width 100px;
    margin: 0px 5px;
  }
`;

const ProgressBar = styled.div`
  max-width: 900px;
  height: 10px;
  border-radius: 5px;
  margin: 10px 0px;
  background-color: #428bca;
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
    parcels: [],
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
    } else {
      parcelApiValues.agencyId = +parcelApiValues.agencyId;
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
    if (ll?.type === LeasedLand.owned && parcels[index]) {
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
  isAdmin,
}) => {
  // access the stepper to later split the form into segments
  const stepper = useFormStepper();
  const formikProps = useFormikContext<ISteppedFormValues<IAssociatedLand>>();

  // lookup codes that will be used by subforms
  const { getOptionsByType } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getOptionsByType(API.PROPERTY_CLASSIFICATION_CODE_SET_NAME);
  const currentParcelNameSpace = `data.parcels.${stepper.currentTab}`;
  useParcelLayerData({
    formikRef,
    nameSpace: currentParcelNameSpace,
    agencyId: +formikProps.values.data.agencyId,
  });

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
              isAdmin={isAdmin}
              isViewOrUpdate={false}
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
        return (
          <LandValuationForm
            nameSpace={currentParcelNameSpace}
            title="Land Valuation"
            showImprovements={true}
          />
        );
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
                getIn(formikProps.values, `data.leasedLandMetadata.${stepper.currentTab}.type`) ===
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
  /** The initial building values to add associated land to */
  initialValues: IBuilding;
  /** Whether or not this user has admin privileges */
  isAdmin: boolean;
}

interface IAssociatedLandParentForm extends IAssociatedLandForm {
  /** signal the parent that the associated land process has been completed. */
  setAssociatedLandComplete: (show: boolean) => void;
}

/**
 * A component used for land associated to a building.
 * This form will appear after a user enters a new building after navigating to Manage Property > Submit Property in PIMS
 * @component
 */
const AssociatedLandForm: React.FC<IAssociatedLandParentForm> = (
  props: IAssociatedLandParentForm,
) => {
  const keycloak = useKeycloakWrapper();
  const { createBuilding, updateBuilding } = useBuildingApi();
  const dispatch = useDispatch();
  const [numParcels, setNumParcels] = useState(1);
  const [progress, setProgress] = useState(0);
  const [initialValues, setInitialValues] = useState({
    activeStep: 0,
    activeTab: 0,
    data: { ...getInitialValues(), ...props.initialValues },
  });
  const api = useApi();

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
      if (
        p.pid &&
        (getIn(initialValues.data, `parcels.${index}.pid`) !== p.pid ||
          !getIn(initialValues.data, `parcels.${index}.id`))
      ) {
        pidDuplicated = !(await isPidAvailable(p));
      }

      let pinDuplicated = false;
      if (
        p.pin &&
        ((getIn(initialValues.data, `parcels.${index}.pin`) !== p.pin &&
          p.pin.toString().length < 10) ||
          !getIn(initialValues.data, `parcels.${index}.id`))
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

  const renderPreForm = (): React.ReactNode => {
    return (
      <>
        <hr />
        <h4 style={{ textAlign: 'left' }}>Parcel inventory</h4>
        <PreAssociateSteps>
          <span>
            <p>1</p>
            <strong>How many parcels does this building straddle?</strong>
            <BSForm.Control as="select" onChange={(e: any) => setNumParcels(+e.target.value)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </BSForm.Control>
          </span>

          <span>
            <p>2</p>
            <Button
              onClick={() => {
                const incrementProgress = () =>
                  setTimeout(() => {
                    let currentProgess = 0;
                    setProgress(p => {
                      currentProgess = p;
                      return ++p;
                    });
                    //use 15 to get the progress bar to show as complete for a half second before continuing.
                    if (currentProgess < 15) {
                      incrementProgress();
                    } else {
                      const parcels = [...Array(numParcels)].map(n => ({
                        ...getInitialLandValues(),
                        agencyId: keycloak.agencyId,
                      }));
                      setInitialValues(setIn(initialValues, 'data.parcels', parcels));
                    }
                  }, 100);
                incrementProgress();
              }}
            >
              Create parcel templates
            </Button>
          </span>
        </PreAssociateSteps>
        <ProgressBar
          className="progress-bar progress-bar-animated"
          style={{ width: `${progress * 10}%` }}
        ></ProgressBar>
        <hr />
      </>
    );
  };

  return (
    <Container className="landForm">
      {!initialValues?.data?.parcels?.length ? (
        renderPreForm()
      ) : (
        <SteppedForm<IAssociatedLand>
          // Provide the steps
          steps={[
            {
              route: 'ownership',
              title: 'Land Ownership',
              completed: false,
              canGoToStep: true,
              validation: {
                schema: AssociatedLandOwnershipSchema,
                nameSpace: (tabIndex: number) => `data.leasedLandMetadata.${tabIndex}`,
              },
            },
            {
              route: 'identification',
              title: 'Identification',
              completed: false,
              canGoToStep: false,
              validation: {
                schema: LandIdentificationSchema,
                nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
              },
            },
            {
              route: 'usage',
              title: 'Usage',
              completed: false,
              canGoToStep: false,
              validation: {
                schema: LandUsageSchema,
                nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
              },
            },
            {
              route: 'valuation',
              title: 'Valuation',
              completed: false,
              canGoToStep: false,
              validation: {
                schema: LandValuationSchema,
                nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
              },
            },
            {
              route: 'review',
              title: 'Review & Submit',
              completed: false,
              canGoToStep: false,
              validation: {
                schema: AssociatedLandSchema,
                nameSpace: (tabIndex: number) => `data`,
              },
            },
          ]}
          getTabs={(values: IAssociatedLand) => {
            return values.parcels.map((p: any, index: number) => {
              return p.name?.length ? p.name : `Parcel ${index + 1}`;
            });
          }}
          persistable={false}
          persistProps={{
            name: 'associatedLand',
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
              props.setAssociatedLandComplete(true);
            } catch (error) {
            } finally {
              actions.setSubmitting(false);
            }
          }}
          tabLineHeader={'Parcels: '}
        >
          <Form
            setMovingPinNameSpace={props.setMovingPinNameSpace}
            handleGeocoderChanges={props.handleGeocoderChanges}
            handlePidChange={props.handlePidChange}
            handlePinChange={props.handlePinChange}
            formikRef={props.formikRef}
            initialValues={props.initialValues}
            isAdmin={props.isAdmin}
          />
        </SteppedForm>
      )}
    </Container>
  );
};
export default AssociatedLandForm;
