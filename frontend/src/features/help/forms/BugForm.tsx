import * as React from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { Input, TextArea } from 'components/common/form';
import { noop } from 'lodash';
import { pimsSupportEmail } from '../constants/HelpText';
import { IHelpForm } from '../interfaces';

interface BugFormProps {
  /** Form values that should overwrite the default form values */
  formValues: IHelpForm;
  /** Call this function whenever the form fields are updated to keep the mailto in sync with this form */
  setMailto: Function;
}
interface IBugForm extends IHelpForm {
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
}

const defaultHelpFormValues: IBugForm = {
  user: '',
  email: '',
  page: '',
  stepsToReproduce: '',
  expectedResult: '',
  actualResult: '',
};

/**
 * Form allowing user to report a bug. The state of this form is synchronized with the parent's mailto.
 */
const BugForm: React.FunctionComponent<BugFormProps> = ({ formValues, setMailto }) => {
  const initialValues = { ...defaultHelpFormValues, ...formValues };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validateOnMount={true}
      validate={(values: any) => {
        const body = `Steps to Reproduce: ${values.stepsToReproduce} Excepted Result: ${values.expectedResult} Actual Result: ${values.actualResult}`;
        const mailto = `mailto:${pimsSupportEmail}?subject=Bug Report - ${formValues.page}&body=${body}`;
        setMailto(mailto);
      }}
    >
      <Form>
        <Input label="User" field="user" />
        <Input label="Email" field="email" />
        <Input label="Page" field="page" />
        <TextArea label="Steps to Reproduce" field="stepsToReproduce" />
        <TextArea label="Expected Result" field="expectedResult" />
        <TextArea label="Actual Result" field="actualResult" />
      </Form>
    </Formik>
  );
};

export default BugForm;
