import { Persist } from 'components/common/FormikPersist';
import { Form, Formik, FormikConfig, setIn, getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { StepperFormProvider } from './context';
import { StepperField } from './StepperField';
import { ISteppedFormProps, ISteppedFormValues, IStepperTab } from './types';
import { Tabs, Tab } from 'react-bootstrap';
import styled from 'styled-components';
import PlusButton from '../PlusButton';
import { FaWindowClose } from 'react-icons/fa';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { useState } from 'react';
import GenericModal from 'components/common/GenericModal';
import { toast } from 'react-toastify';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import _ from 'lodash';
import { IStep } from 'components/common/Stepper';
import { ILeasedLand } from 'features/mapSideBar/SidebarContents/AssociatedLandForm';
import variables from '_variables.module.scss';
import AbbreviatedText from 'components/common/AbbreviatedText';

const TabbedForm = styled(Form)`
  .hideTabs {
    a.nav-item {
      background-color: white;
      display: none;
    }
  }
  .nav-tabs > .nav-item:last-child {
    border: 0;
    svg {
      position: relative;
      color: white;
    }
    padding: 0;
  }
  .tab-content {
    border: 0;
    border-top: 1px solid #666666;
    padding: 0;
  }
  .nav-tabs {
    .nav-item.active {
      border: 0;
      color: white;
      svg {
        background-color: ${variables.secondaryVariantColor};
        color: white;
      }
    }
    .nav-item {
      border: 1px solid black;
      background-color: white;
      color: black;
      position: relative;
      display: inline-flex;
      p,
      abbr {
        margin: 0;
      }
      position: relative;
      svg {
        color: black;
        position: absolute;
        top: 1px;
        right: 1px;
      }
    }
    border: 0;
    .btn:disabled {
      background-color: ${variables.primaryColor};
      cursor: default;
    }
  }
`;

const TabLineHeader = styled.h5`
  float: left;
  margin-right: 50px;
`;

export const MAX_STEPPED_TABS = 5;

/**
 * A formik form with a stepper. Use the ```useFormStepper``` hook to access and control the stepper in the form children
 * @component
 * @example ./SteppedForm.md
 */
export const SteppedForm = function<T extends object = {}>({
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
          <TabbedForm>
            {!!getTabs && tabLineHeader && <TabLineHeader>{tabLineHeader}</TabLineHeader>}
            <Tabs
              id="steppedform-tabs"
              className={!getTabs ? 'hideTabs' : ''}
              activeKey={values.activeTab}
              onSelect={(tab: string) => {
                if (tab !== '') {
                  setFieldValue('activeTab', +tab);
                  onChangeTab && setSteps(onChangeTab(+tab));
                }
              }}
              unmountOnExit
            >
              {getFormikTabs(values.data).map((tab, index) => (
                <Tab
                  title={tabTitle(tab.name, index, setTabToDeleteId)}
                  eventKey={index}
                  key={`stepped-tab-${index}`}
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
                title={
                  <PlusButton
                    disabled={(values?.tabs?.length ?? 0) >= MAX_STEPPED_TABS}
                    toolText="Add another associated Parcel"
                    toolId="add-associated-parcel"
                    onClick={() => {
                      //update the data model that the tab represents
                      onAddTab && onAddTab(values.data);
                      //add a new tab to the formik tab tracker.
                      setFieldValue('tabs', [
                        ...values.tabs,
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
          </TabbedForm>
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
