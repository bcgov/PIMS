import { Persist } from 'components/common/FormikPersist';
import { Form, Formik, FormikConfig, setIn } from 'formik';
import * as React from 'react';
import { StepperFormProvider } from './context';
import { StepperField } from './StepperField';
import { ISteppedFormProps, ISteppedFormValues } from './types';
import { Tabs, Tab } from 'react-bootstrap';
import styled from 'styled-components';
import PlusButton from '../PlusButton';
import { FaWindowClose } from 'react-icons/fa';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { useState } from 'react';
import GenericModal from 'components/common/GenericModal';

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
        background-color: #428bca;
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
      background-color: #003366;
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
  tabLineHeader,
  ...rest
}: ISteppedFormProps<T> & FormikConfig<ISteppedFormValues<T>>) {
  const [tabToDeleteId, setTabToDeleteId] = useState<number | undefined>();
  const [steps] = useState(formSteps);
  if (rest.persistable && !rest.persistProps) {
    throw new Error('SteppedForm: "persistProps" are required when "persistable" is true');
  }

  if (!getTabs) {
    initialValues.tabs = [{ activeStep: initialValues.activeStep }];
  }
  if (!initialValues.tabs && !!getTabs) {
    initialValues = setIn(
      initialValues,
      'tabs',
      getTabs(initialValues.data).map(t => ({ activeStep: 0, name: t })),
    );
  }

  const tabTitle = (title: string, index: number) => {
    return (
      <>
        {title.length < 20 ? <p>{title}</p> : <abbr title={title}>{title.substr(0, 20)}</abbr>}
        <TooltipWrapper
          toolTipId="remove-associated-parcel"
          toolTip="Remove this associated parcel"
        >
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
  const getFormikTabs = getTabs ? getTabs : () => ['Tab 1'];

  return (
    <Formik<ISteppedFormValues<T>>
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      innerRef={formikRef}
      {...rest}
    >
      {({ values, setFieldValue, submitForm }) => (
        <>
          <TabbedForm>
            {!!getTabs && tabLineHeader && <TabLineHeader>{tabLineHeader}</TabLineHeader>}
            <Tabs
              id="steppedform-tabs"
              className={!getTabs ? 'hideTabs' : ''}
              activeKey={values.activeTab}
              onSelect={(tab: string) => {
                if (tab !== '') {
                  setFieldValue('activeTab', +tab);
                }
              }}
              unmountOnExit
            >
              {getFormikTabs(values.data).map((tab, index) => (
                <Tab title={tabTitle(tab, index)} eventKey={index} key={`stepped-tab-${index}`}>
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
                    }}
                  />
                }
              ></Tab>
            </Tabs>
            <GenericModal
              display={tabToDeleteId !== undefined}
              setDisplay={() => setTabToDeleteId(undefined)}
              title="Really Remove Associated Parcel?"
              message="Click OK to remove the association between this parcel and the current building."
              handleOk={() => {
                if (values.tabs && onRemoveTab && tabToDeleteId !== undefined) {
                  //remove the underlying data representing the tab
                  onRemoveTab(values.data, tabToDeleteId);
                  //remove the tab itself.
                  const tabs = [...values.tabs];
                  tabs.splice(tabToDeleteId, 1);
                  setFieldValue('tabs', tabs);
                  //If the user deletes the last tab, set the active tab to the previous tab.
                  if (values.activeTab >= values.tabs.length - 1) {
                    setFieldValue('activeTab', values.tabs.length - 2);
                  }
                  //if the user deletes ALL associated land, save that to the database.
                  if (tabs.length === 0) {
                    submitForm();
                  }
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

export default SteppedForm;
