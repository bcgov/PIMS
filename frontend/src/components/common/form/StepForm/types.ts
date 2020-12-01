import { IStep } from 'components/common/Stepper';

export interface IStepperFormContextProps {
  current: number;
  currentTab: number;
  gotoStep: (step: number) => boolean;
  goBack: () => boolean;
  gotoNext: () => boolean;
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

export interface ISteppedFormProps {
  steps: IStep[];
  getTabs?: () => string[];
  // set to true to make to the form persist to localstorage
  persistable?: boolean;
  // options to set persist component
  persistProps?: IPersistProps;
  formikRef?: any;
  onAddTab?: () => void;
  onRemoveTab?: (index: number) => void;
}

export interface IStepperFieldProps {
  name: string;
  steps: IStep[];
}

export interface IStepperFormProviderProps {
  steps: IStep[];
  tabs: string[];
}

export interface IStepperTab {
  activeStep: number;
  name: string;
}
