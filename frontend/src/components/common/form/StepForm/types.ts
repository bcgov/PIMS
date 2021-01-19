import { IStep } from 'components/common/Stepper';

export interface IStepperFormContextProps {
  current: number;
  currentTab: number;
  currentTabName: string;
  getTabCurrentStep: (tab: number) => number;
  gotoStep: (step: number, override?: boolean) => boolean;
  goBack: () => boolean;
  gotoNext: () => boolean;
  gotoTab: (tab: number) => boolean;
  validateCurrentStep: (overrideNameSpace?: string) => boolean;
  isSubmit: (step: number) => boolean;
}

export interface ISteppedFormValues<T extends object = {}> {
  activeStep: number;
  activeTab: number;
  data: T;
  tabs?: any[];
}

export interface IPersistProps {
  // Name of of the localstorage key
  name: string;
  // Secret used to encrypt/decrypt the form data
  secret: string;
  persistCallback: (values: any) => void;
}

export interface ISteppedFormProps<T extends {}> {
  steps: IStep[];
  getTabs?: (values: T) => IStepperTab[];
  // set to true to make to the form persist to localstorage
  persistable?: boolean;
  // options to set persist component
  persistProps?: IPersistProps;
  formikRef?: any;
  onAddTab?: (values: T) => void;
  onRemoveTab?: (values: ISteppedFormValues<T>, index: number, shouldSubmit: boolean) => void;
  onChangeTab?: (tabIndex: number) => IStep[];
  tabLineHeader?: string;
}

export interface IStepperFieldProps {
  name: string;
  steps: IStep[];
}

export interface IStepperFormProviderProps {
  steps: IStep[];
  tabs: IStepperTab[];
}

export interface IStepperTab {
  activeStep: number;
  completedSteps: number[];
  name: string;
}
