import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, Input, TextArea } from 'components/common/form';

import { IStepProps } from '../interfaces';

/**
 * Form component of ProjectDraftForm.
 * @param param0 isReadOnly disable editing
 */
const ProjectDraftForm = ({ isReadOnly }: IStepProps) => {
  return (
    <Fragment>
      <Row style={{ textAlign: 'left' }}>
        <Col>
          <Form.Row>
            <Form.Label column md={2}>
              Project Number
            </Form.Label>
            <Input
              placeholder="SPP-XXXXXX"
              disabled={true}
              outerClassName="col-md-8"
              field="projectNumber"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Name
            </Form.Label>
            <Input outerClassName="col-md-8" field="name" />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Description
            </Form.Label>
            <Input outerClassName="col-md-8" field="description" />
          </Form.Row>
          {!isReadOnly && (
            <Form.Row>
              <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
                Notes:
              </Form.Label>
              <TextArea outerClassName="col-md-8" field="note" />
            </Form.Row>
          )}
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProjectDraftForm;
