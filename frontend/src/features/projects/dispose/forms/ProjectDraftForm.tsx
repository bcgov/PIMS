import './ProjectDraftForm.scss';
import React, { Fragment, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Form, Input } from 'components/common/form';
import { IStepProps, ProjectNotes } from '..';

/**
 * Form component of ProjectDraftForm.
 * @param param0 isReadOnly disable editing
 */
const ProjectDraftForm = ({ isReadOnly }: IStepProps) => {
  const [disabled, setDisabled] = useState(isReadOnly);
  return (
    <Fragment>
      <Button disabled={!disabled} className="edit" onClick={() => setDisabled(false)}>
        Edit
      </Button>
      {isReadOnly && <h3>Review</h3>}
      <Row style={{ textAlign: 'left' }} className="ProjectDraftForm">
        <Col>
          <Form.Row>
            <Input
              placeholder="SPP-XXXXXX"
              disabled={true}
              field="projectNumber"
              label="Project Number"
              className="col-md-2"
              outerClassName="col-md-10"
              required
            />
          </Form.Row>
          <Form.Row>
            <Input
              disabled={disabled}
              field="name"
              label="Name"
              className="col-md-3"
              outerClassName="col-md-10"
              required
            />
          </Form.Row>
          <Form.Row>
            <Input
              disabled={disabled}
              field="description"
              label="Description"
              className="col-md-5"
              outerClassName="col-md-10"
            />
          </Form.Row>
          {!isReadOnly && <ProjectNotes className="col-md-12" />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default ProjectDraftForm;
