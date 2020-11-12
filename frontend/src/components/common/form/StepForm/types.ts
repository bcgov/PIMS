import { PersistProps } from 'components/common/FormikPersist';
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

export interface ISteppedFormProps {
  steps: IStep[];
  persistable?: boolean;
  persistProps?: PersistProps;
}

export interface IStepperFieldProps {
  name: string;
  steps: IStep[];
}

export interface IStepperFormProviderProps {
  steps: IStep[];
}
