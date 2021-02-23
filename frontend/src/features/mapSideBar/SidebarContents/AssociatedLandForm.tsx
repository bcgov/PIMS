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
import { IBuilding, IParcel, LeasedLandTypes } from 'actions/parcelsActions';
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
  ValuationSchema,
  LandSchema,
} from 'utils/YupSchema';
import { useDispatch } from 'react-redux';
import { useBuildingApi } from '../hooks/useBuildingApi';
import _ from 'lodash';
import { useState } from 'react';
import { defaultBuildingValues } from './BuildingForm';
import { stringToNull } from 'utils';
import { IStep } from 'components/common/Stepper';
import useDraftMarkerSynchronizer from 'features/properties/hooks/useDraftMarkerSynchronizer';
import DebouncedValidation from 'features/properties/components/forms/subforms/DebouncedValidation';
import {
  filterEmptyFinancials,
  getMergedFinancials,
} from 'features/properties/components/forms/subforms/EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import variables from '_variables.module.scss';

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
  background-color: ${variables.filterBackgroundColor};
  bottom: 25px;
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
  background-color: ${variables.secondaryVariantColor};
`;

export interface IAssociatedLand extends IBuilding {
  parcels: IParcel[];
  leasedLandMetadata: ILeasedLand[];
}

export interface ILeasedLand {
  ownershipNote: string;
  type: LeasedLandTypes;
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
  apiValues.data.leaseExpiry = stringToNull(apiValues.data.leaseExpiry);
  apiValues.data.buildingTenancyUpdatedOn = stringToNull(apiValues.data.buildingTenancyUpdatedOn);
  apiValues.data.evaluations = filterEmptyFinancials(apiValues.data.evaluations);
  apiValues.data.fiscals = filterEmptyFinancials(apiValues.data.fiscals);
  const ownedParcels: IParcel[] = getOwnedParcels(
    values.data.leasedLandMetadata,
    values.data.parcels,
  );

  apiValues.data.parcels = ownedParcels.map((p: any) => {
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
  parcels.forEach((parcel: IParcel, index: number) => {
    const ll = getIn(leasedLand, index.toString());
    if (ll?.type !== LeasedLandTypes.other) {
      if (ll !== undefined) {
        ll.parcelId = parcel.id === '' ? 0 : parcel.id;
      }
      ownedParcels.push(parcel);
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
  isPropertyAdmin,
}) => {
  // access the stepper to later split the form into segments
  const stepper = useFormStepper();
  const formikProps = useFormikContext<ISteppedFormValues<IAssociatedLand>>();

  // lookup codes that will be used by subforms
  const { getOptionsByType, getPropertyClassificationOptions } = useCodeLookups();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const classifications = getPropertyClassificationOptions();
  const currentParcelNameSpace = `data.parcels.${stepper.currentTab}`;
  useDraftMarkerSynchronizer(`data.parcels.${stepper.currentTab}`);
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
      case AssociatedLandSteps.IDENTIFICATION_OR_REVIEW:
        return getIn(formikProps.values, `data.leasedLandMetadata.${stepper.currentTab}.type`) ===
          LeasedLandTypes.owned ? (
          <div className="parcel-identification">
            <ParcelIdentificationForm
              nameSpace={currentParcelNameSpace}
              agencies={agencies}
              classifications={classifications}
              handleGeocoderChanges={handleGeocoderChanges}
              setMovingPinNameSpace={setMovingPinNameSpace}
              handlePidChange={handlePidChange}
              handlePinChange={handlePinChange}
              isPropertyAdmin={isPropertyAdmin}
              isViewOrUpdate={false}
            />
          </div>
        ) : (
          <AssociatedLandReviewPage
            nameSpace={`data.parcels`}
            classifications={classifications}
            agencies={agencies}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            isPropertyAdmin={isPropertyAdmin}
          />
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
        {formikProps.dirty && formikProps.isValid && stepper.isSubmit(stepper.current) && (
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
  setMovingPinNameSpace: (nameSpace?: string) => void;
  /** to autopopulate fields based on Geocoder information */
  handlePidChange: (pid: string) => void;
  /** help with formatting of the pin */
  handlePinChange: (pin: string) => void;
  /** The initial building values to add associated land to */
  initialValues: IAssociatedLand;
  /** Whether or not this user has property admin priviledges */
  isPropertyAdmin: boolean;
}

interface IAssociatedLandParentForm extends IAssociatedLandForm {
  /** signal the parent that the associated land process has been completed. */
  setAssociatedLandComplete: (show: boolean) => void;
}

const getSteps = (formikRef: any, tab: number) => {
  let initialLeasedLandMetadata: ILeasedLand | undefined = undefined;
  let leasedLandMetadata: ILeasedLand | undefined = undefined;
  if (formikRef.current) {
    const { initialValues, values } = formikRef.current;
    initialLeasedLandMetadata = getIn(initialValues.data.leasedLandMetadata, tab.toString());
    leasedLandMetadata = getIn(values.data.leasedLandMetadata, tab.toString());
  }
  const ownedSteps: IStep[] = [
    {
      route: 'identification',
      title: 'Identification',
      completed: false,
      canGoToStep: !!initialLeasedLandMetadata,
      validation: {
        schema: LandIdentificationSchema,
        nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
      },
    },
    {
      route: 'usage',
      title: 'Usage',
      completed: false,
      canGoToStep: !!initialLeasedLandMetadata,
      validation: {
        schema: LandUsageSchema,
        nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
      },
    },
    {
      route: 'valuation',
      title: 'Valuation',
      completed: false,
      canGoToStep: !!initialLeasedLandMetadata,
      validation: {
        schema: ValuationSchema,
        nameSpace: (tabIndex: number) => `data.parcels.${tabIndex}`,
      },
    },
  ];
  return [
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
    ...(leasedLandMetadata?.type !== LeasedLandTypes.other ? ownedSteps : []),
    {
      route: 'review',
      title: 'Review & Submit',
      completed: false,
      canGoToStep: !!initialLeasedLandMetadata,
      validation: {
        schema: AssociatedLandSchema,
        nameSpace: (tabIndex: number) => `data`,
      },
    },
  ];
};

const getParcels = (initialValues: IAssociatedLand): IParcel[] => {
  const parcels: IParcel[] = [];
  let parcelIndex = 0;
  if (initialValues?.leasedLandMetadata?.length) {
    initialValues?.leasedLandMetadata?.forEach(llm => {
      if (llm.type === LeasedLandTypes.owned && parcelIndex < initialValues.parcels.length) {
        parcels.push(initialValues.parcels[parcelIndex++]);
      } else {
        parcels.push(getInitialLandValues());
      }
    });
    const missingParcels = _.difference(initialValues.parcels, parcels);
    if (missingParcels.length > 0) {
      return [...parcels, ...missingParcels];
    }
  } else {
    return initialValues.parcels;
  }
  return parcels;
};

/**
 * A component used for land associated to a building.
 * This form will appear after a user enters a new building after navigating to Manage Property > Submit Property in PIMS
 * @component
 */
const AssociatedLandForm: React.FC<IAssociatedLandParentForm> = (
  props: IAssociatedLandParentForm,
) => {
  const keycloak = useKeycloakWrapper();
  const { updateBuilding } = useBuildingApi();
  const dispatch = useDispatch();
  const [numParcels, setNumParcels] = useState(1);
  const [progress, setProgress] = useState(0);
  const parcels =
    getParcels(props.initialValues as any)?.map(p => ({
      ...p,
      fiscals: getMergedFinancials(p?.fiscals ?? [], Object.values(FiscalKeys)),
      evaluations: getMergedFinancials(p?.evaluations ?? [], Object.values(EvaluationKeys)),
    })) ?? [];
  const [initialValues, setInitialValues] = useState({
    activeStep: 0,
    activeTab: 0,
    data: {
      ...getInitialValues(),
      ...props.initialValues,
      parcels,
    },
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

    let errors = {};
    await Promise.all(
      ownedParcels.map(async (p: any) => {
        const index = values.data.parcels.indexOf(p);
        const yupErrors: any = await LandSchema.validate(p, {
          abortEarly: false,
        }).then(
          () => ({}),
          (err: any) => yupToFormErrors(err),
        );
        if (Object.keys(yupErrors).length > 0) {
          errors = setIn(errors, `data.parcels.${index}`, yupErrors);
        }

        let pidDuplicated = false;
        if (p.pid && getIn(initialValues.data, `parcels.${index}.pid`) !== p.pid && !p.id) {
          pidDuplicated = !(await isPidAvailable(p));
        }

        let pinDuplicated = false;
        if (
          p.pin &&
          getIn(initialValues.data, `parcels.${index}.pin`) !== p.pin &&
          p.pin.toString().length < 10 &&
          !p.id
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
      }),
    );
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IParcel): Promise<boolean> => {
    const response = await api.isPinAvailable(values.id, values.pin);
    return response?.available;
  };

  const submit = async (newValues: ISteppedFormValues<IAssociatedLand>, isSubmit = false) => {
    const { resetForm, setSubmitting } = props.formikRef.current;
    const apiValues = valuesToApiFormat(_.cloneDeep(newValues), keycloak.agencyId);
    try {
      const building = await updateBuilding(apiValues)(dispatch);
      const actualBuilding = { ...building, parcels: getParcels(building) };
      if (isSubmit) {
        props.setAssociatedLandComplete(true);
      }
      const updatedValues = { ...newValues, data: actualBuilding };
      resetForm({
        values: updatedValues,
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
      //TODO: remove any drafts for updated buildings as saving associated land also saves the building, which invalidates any drafts.
      window.localStorage.removeItem('updated-building');
    }
  };
  const maxProgress = 15;

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
                const parcels = [...Array(numParcels)].map(n => ({
                  ...getInitialLandValues(),
                  agencyId: keycloak.agencyId,
                }));
                setInitialValues(setIn(initialValues, 'data.parcels', parcels));
                const incrementProgress = () =>
                  setTimeout(() => {
                    let currentProgess = 0;
                    setProgress(p => {
                      currentProgess = p;
                      return ++p;
                    });
                    //use 15 to get the progress bar to show as complete for a half second before continuing.
                    if (currentProgess < maxProgress) {
                      incrementProgress();
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
      {!props.initialValues?.leasedLandMetadata?.length &&
      !props.initialValues?.parcels?.length &&
      progress < maxProgress ? (
        renderPreForm()
      ) : (
        <SteppedForm<IAssociatedLand>
          // Provide the steps
          steps={getSteps(props.formikRef, 0)}
          getTabs={(values: IAssociatedLand) => {
            return values.parcels.map((p: any, index: number) => {
              const parcelMetadata = getIn(
                props.initialValues.leasedLandMetadata,
                index.toString(),
              );
              if (!parcelMetadata) {
                return {
                  activeStep: 0,
                  name: p.name?.length ? p.name : `Parcel ${index + 1}`,
                  completedSteps: [],
                };
              } else {
                return {
                  activeStep:
                    parcelMetadata.type === LeasedLandTypes.other
                      ? AssociatedLandSteps.IDENTIFICATION_OR_REVIEW
                      : AssociatedLandSteps.REVIEW,
                  name: p.name?.length ? p.name : `Parcel ${index + 1}`,
                  completedSteps: [],
                };
              }
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
              props.formikRef.current.setFieldValue('data.parcels', [
                ...values.parcels,
                getInitialLandValues(),
              ]);
            }
          }}
          onRemoveTab={(
            formValues: ISteppedFormValues<IAssociatedLand>,
            tabIndex: number,
            shouldSubmit: boolean,
          ) => {
            if (formValues?.data?.parcels.length > tabIndex) {
              const { setValues } = props.formikRef.current;
              const newValues = {
                ...formValues,
                data: {
                  ...formValues.data,
                  parcels: [
                    ...formValues.data.parcels.slice(0, tabIndex),
                    ...formValues.data.parcels.slice(tabIndex + 1),
                  ],
                  leasedLandMetadata: [
                    ...formValues.data.leasedLandMetadata.slice(0, tabIndex),
                    ...formValues.data.leasedLandMetadata.slice(tabIndex + 1),
                  ],
                },
              };

              if (shouldSubmit) {
                submit(newValues);
              } else {
                setValues(newValues);
              }
            }
          }}
          onChangeTab={(tab: number) => {
            return getSteps(props.formikRef, tab);
          }}
          initialValues={initialValues}
          validate={handleValidate}
          validateOnChange={false}
          validateOnBlur={true}
          formikRef={props.formikRef}
          onSubmit={async (values, actions) => {
            submit(values, true);
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
            isPropertyAdmin={props.isPropertyAdmin}
          />
        </SteppedForm>
      )}
    </Container>
  );
};
export default AssociatedLandForm;
