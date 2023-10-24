import './HelpForms.scss';

import { Input, TextArea } from 'components/common/form';
import { Formik } from 'formik';
import { noop } from 'lodash';
import * as React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

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

const leftColumnWidth = 3;

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
              Steps to Reproduce
            </Col>
            <Col>
              <TextArea field="stepsToReproduce" />
            </Col>
          </Row>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              Expected Result
            </Col>
            <Col>
              <TextArea field="expectedResult" />
            </Col>
          </Row>
          <Row>
            <Col xs={leftColumnWidth} className="left-column">
              Actual Result
            </Col>
            <Col>
              <TextArea field="actualResult" />
            </Col>
          </Row>
        </Container>
      </Form>
    </Formik>
  );
};

export default BugForm;
