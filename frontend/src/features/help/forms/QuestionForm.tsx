import './HelpForms.scss';

import { Input, TextArea } from 'components/common/form';
import { Formik } from 'formik';
import { noop } from 'lodash';
import * as React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

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

const leftColumnWidth = 3;

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
      <Form className="help-form">
        <Container>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              User
            </Col>
            <Col>
              <Input field="user" />
            </Col>
          </Row>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              Email
            </Col>
            <Col>
              <Input field="email" />
            </Col>
          </Row>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              Page
            </Col>
            <Col>
              <Input field="page" />
            </Col>
          </Row>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              Question
            </Col>
            <Col>
              <TextArea field="question" />
            </Col>
          </Row>
        </Container>
      </Form>
    </Formik>
  );
};

export default QuestionForm;
