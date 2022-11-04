import { Input, TextArea } from 'components/common/form';
import { Formik } from 'formik';
import { noop } from 'lodash';
import * as React from 'react';
import { Form } from 'react-bootstrap';

import { pimsSupportEmail } from '../constants/HelpText';
import { IHelpForm } from '../interfaces';

interface FeatureRequestFormProps {
  /** Form values that should overwrite the default form values */
  formValues: IHelpForm;
  /** Call this function whenever the form fields are updated to keep the mailto in sync with this form */
  setMailto: Function;
}
interface IFeatureRequestForm extends IHelpForm {
  description: string;
}

const defaultHelpFormValues: IFeatureRequestForm = {
  user: '',
  email: '',
  page: '',
  description: '',
};

/**
 * Form allowing user to request a feature. The state of this form is synchronized with the parent's mailto.
 */
const FeatureRequestForm: React.FunctionComponent<FeatureRequestFormProps> = ({
  formValues,
  setMailto,
}) => {
  const initialValues = { ...defaultHelpFormValues, ...formValues };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validateOnMount={true}
      validate={(values: any) => {
        const body = values.description;
        const mailto = `mailto:${pimsSupportEmail}?subject=Feature Request - ${formValues.page}&body=${body}`;
        setMailto(mailto);
      }}
    >
      <Form>
        <Input label="User" field="user" style={{ marginLeft: '49px', marginBottom: '10px' }} />
        <Input label="Email" field="email" style={{ marginLeft: '42px', marginBottom: '10px' }} />
        <TextArea label="Description" field="description" />
      </Form>
    </Formik>
  );
};

export default FeatureRequestForm;
