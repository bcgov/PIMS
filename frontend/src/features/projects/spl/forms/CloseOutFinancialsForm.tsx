import { Fragment } from 'react';
import React from 'react';
import { Form } from 'components/common/form';
import { ProjectNotes } from 'features/projects/common';
import { Col } from 'react-bootstrap';

interface CloseOutFinancialsFormProps {
  isReadOnly?: boolean;
}

const CloseOutFinancialsForm = (props: CloseOutFinancialsFormProps) => {
  return (
    <Fragment>
      <h3>Financing Information</h3>
      <Form.Row>
        <Col>
          <ProjectNotes
            data-testid="loanTermsNote"
            field="loanTermsNote"
            label="Loan Terms"
            className="col-md-10"
            outerClassName="col"
            disabled={props.isReadOnly}
          />
        </Col>
        <Col md={1}></Col>
        <Col>
          <ProjectNotes
            data-testid="closeOutNote"
            field="closeOutNote"
            label="Close Out"
            className="col-md-10"
            outerClassName="col"
            disabled={props.isReadOnly}
          />
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutFinancialsForm;
