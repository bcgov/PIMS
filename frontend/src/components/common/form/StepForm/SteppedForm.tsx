import './SteppedForm.scss';

import AbbreviatedText from 'components/common/AbbreviatedText';
import { Persist } from 'components/common/FormikPersist';
import GenericModal from 'components/common/GenericModal';
import { IStep } from 'components/common/Stepper';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ILeasedLand } from 'features/mapSideBar/SidebarContents/AssociatedLandForm';
import { Formik, FormikConfig, getIn, setIn, useFormikContext } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import _ from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { FaWindowClose } from 'react-icons/fa';
import { toast } from 'react-toastify';

import StringButton from '../StringButton';
import { StepperFormProvider } from './context';
import { StepperField } from './StepperField';
import { ISteppedFormProps, ISteppedFormValues, IStepperTab } from './types';

export const MAX_STEPPED_TABS = 5;

/**
 * A formik form with a stepper. Use the ```useFormStepper``` hook to access and control the stepper in the form children
 * @component
 * @example ./SteppedForm.md
 */
export const SteppedForm = function <T extends object>({
  steps: formSteps,
  children,
  initialValues,
  validate,
  onSubmit,
  formikRef,
  getTabs,
  onAddTab,
  onRemoveTab,
  onChangeTab,
  tabLineHeader,
  ...rest
}: ISteppedFormProps<T> & FormikConfig<ISteppedFormValues<T>>) {
  const [tabToDeleteId, setTabToDeleteId] = useState<number | undefined>();
  const [steps, setSteps] = useState([...formSteps]);
  if (rest.persistable && !rest.persistProps) {
    throw new Error('SteppedForm: "persistProps" are required when "persistable" is true');
  }

  let stepperValues = { ...initialValues };
  if (!getTabs) {
    stepperValues.tabs = [{ activeStep: stepperValues.activeStep }];
  } else {
    stepperValues = setIn(stepperValues, 'tabs', getTabs(stepperValues.data));
  }
  const getFormikTabs = getTabs
    ? getTabs
    : (): IStepperTab[] => [{ name: 'Tab 1', activeStep: 0, completedSteps: [] }];

  return (
    <Formik<ISteppedFormValues<T>>
      initialValues={stepperValues}
      onSubmit={onSubmit}
      validate={validate}
      innerRef={formikRef}
      {...rest}
    >
      {({ values, setFieldValue, validateForm, initialValues: initalFormValues }) => (
        <>
          <StepChanger setSteps={setSteps} onChangeTab={onChangeTab}></StepChanger>
          <div>
            {!!getTabs && tabLineHeader && <div className="tab-line-header">{tabLineHeader}</div>}
            <Tabs
              id="steppedform-tabs"
              className={!getTabs ? 'hideTabs' : ''}
              activeKey={values.activeTab}
              onSelect={(tab: string | null) => {
                if (tab !== '') {
                  setFieldValue('activeTab', +(tab ?? ''));
                  onChangeTab && setSteps(onChangeTab(+(tab ?? '')));
                }
              }}
              unmountOnExit
            >
              {getFormikTabs(values.data).map((tab, index) => (
                <Tab
                  title={tabTitle(tab.name, index, setTabToDeleteId)}
                  eventKey={index}
                  key={`stepped-tab-${index}`}
                  className="nav-item"
                >
                  <StepperFormProvider steps={steps} tabs={getFormikTabs(values.data)}>
                    <>
                      <StepperField name={`tabs.${values.activeTab}.activeStep`} steps={steps} />
                      {children}
                    </>
                  </StepperFormProvider>
                </Tab>
              ))}
              <Tab
                disabled={(values?.tabs?.length ?? 0) >= MAX_STEPPED_TABS}
                eventKey=""
                className="nav-item"
                title={
                  <StringButton
                    disabled={(values?.tabs?.length ?? 0) >= MAX_STEPPED_TABS}
                    toolText="Add Parcel"
                    stringText="Add another associated Parcel"
                    toolId="add-associated-parcel"
                    className="nav-item"
                    data-testid="add-tab"
                    onClick={() => {
                      //update the data model that the tab represents
                      onAddTab && onAddTab(values.data);
                      //add a new tab to the formik tab tracker.
                      setFieldValue('tabs', [
                        ...(values?.tabs ?? []),
                        { activeStep: 0, name: `Parcel ${(values?.tabs?.length ?? 0) + 1}` },
                      ]);
                      //set the current tab to the newly added tab.
                      setFieldValue('activeTab', values?.tabs?.length ?? 0);
                      onChangeTab && setSteps(_.cloneDeep(onChangeTab(values?.tabs?.length ?? 0)));
                    }}
                  />
                }
              ></Tab>
            </Tabs>
            {getFormikTabs(values.data).length === 0 && (
              <p>No Associated Land. Press the '+' icon to add Associated Land</p>
            )}
            <GenericModal
              display={tabToDeleteId !== undefined}
              setDisplay={() => setTabToDeleteId(undefined)}
              title="Really Remove Associated Parcel?"
              message="Click OK to remove the association between this parcel and the current building."
              handleOk={async () => {
                const hasLeasedLand = !!getIn(
                  initalFormValues.data,
                  `leasedLandMetadata.${tabToDeleteId}`,
                );
                if (hasLeasedLand) {
                  const errors = await validateForm();
                  if (Object.keys(errors).length !== 0) {
                    toast.error(
                      'Unable to remove associated land, as one or more other associated land(s) is in error. Please correct all errors and then retry.',
                      { autoClose: 10000 },
                    );
                    return;
                  }
                }
                if (values.tabs && onRemoveTab && tabToDeleteId !== undefined) {
                  //remove the tab itself.
                  values.tabs.splice(tabToDeleteId, 1);
                  //If the user deletes the last tab, set the active tab to the previous tab.
                  if (values.tabs.length > 0) {
                    values.activeTab = values.tabs.length - 1;
                  }
                  //remove the underlying data representing the tab
                  onRemoveTab({ ...values }, tabToDeleteId, hasLeasedLand);
                }
              }}
              cancelButtonText="Cancel"
            />
          </div>
          {rest.persistable && <Persist {...rest.persistProps!} initialValues={initialValues} />}
        </>
      )}
    </Formik>
  );
};

const tabTitle = (title: string, index: number, setTabToDeleteId: (index: number) => void) => {
  return (
    <>
      <AbbreviatedText text={title} maxLength={20} />
      <TooltipWrapper toolTipId="remove-associated-parcel" toolTip="Remove this associated parcel">
        <FaWindowClose
          size={15}
          data-testid={`delete-parcel-${index + 1}`}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setTabToDeleteId(index);
          }}
        ></FaWindowClose>
      </TooltipWrapper>
    </>
  );
};

/** Simple Formik component that fetches new steps whenever the leasedLandMetadata changes */
const StepChanger = ({
  setSteps,
  onChangeTab,
}: {
  setSteps: any;
  onChangeTab?: (tabIndex: number) => IStep[];
}) => {
  const { values } = useFormikContext<any>();
  let currentLeasedLandMetadata: ILeasedLand | undefined;
  if (values.data) {
    currentLeasedLandMetadata = getIn(values.data.leasedLandMetadata, values.activeTab);
  }
  useDeepCompareEffect(() => {
    if (!!onChangeTab && currentLeasedLandMetadata) {
      setSteps(onChangeTab(values.activeTab));
    }
  }, [currentLeasedLandMetadata, setSteps]);
  return null;
};

export default SteppedForm;
