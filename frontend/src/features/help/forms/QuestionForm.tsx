import { Input, TextArea } from 'components/common/form';
import { Formik } from 'formik';
import { noop } from 'lodash';
import * as React from 'react';
import { Form } from 'react-bootstrap';

import { pimsSupportEmail } from '../constants/HelpText';
import { IHelpForm } from '../interfaces';

interface QuestionFormProps {
  /** Form values that should overwrite the default form values */
  formValues: IHelpForm;
  /** Call this function whenever the form fields are updated to keep the mailto in sync with this form */
  setMailto: Function;
}
interface IQuestionForm extends IHelpForm {
  question: string;
}

const defaultHelpFormValues: IQuestionForm = {
  user: '',
  email: '',
  page: '',
  question: '',
};

/**
 * Form allowing user to ask a question. The state of this form is synchronized with the parent's mailto.
 */
const QuestionForm: React.FunctionComponent<QuestionFormProps> = ({ formValues, setMailto }) => {
  const initialValues = { ...defaultHelpFormValues, ...formValues };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={noop}
      validateOnMount={true}
      validate={(values: any) => {
        const body = values.question;
        const mailto = `mailto:${pimsSupportEmail}?subject=Question - ${formValues.page}&body=${body}`;
        setMailto(mailto);
      }}
    >
      <Form>
        <Input label="User" field="user" style={{ marginLeft: '27px', marginBottom: '5px' }} />
        <Input label="Email" field="email" style={{ marginLeft: '23px', marginBottom: '5px' }} />
        <Input label="Page" field="page" style={{ marginLeft: '27px', marginBottom: '5px' }} />
        <TextArea label="Question" field="question" />
      </Form>
    </Formik>
  );
};

export default QuestionForm;
