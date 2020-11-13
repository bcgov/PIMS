import { IStep } from 'components/common/Stepper';

export interface IStepperFormContextProps {
  current: number;
  gotoStep: (step: number) => boolean;
  goBack: () => boolean;
  gotoNext: () => boolean;
}

export interface ISteppedFormValues<T extends object = {}> {
  activeStep: number;
  data: T;
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
  // set to true to make to the form persist to localstorage
  persistable?: boolean;
  // options to set persist component
  persistProps?: IPersistProps;
}

export interface IStepperFieldProps {
  name: string;
  steps: IStep[];
}

export interface IStepperFormProviderProps {
  steps: IStep[];
}
