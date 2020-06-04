import './ProjectDraftForm.scss';
import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Form, Input } from 'components/common/form';
import { IStepProps, ProjectNotes, projectNoDescription } from '..';
import styled from 'styled-components';

const ItalicText = styled.div`
  font-family: 'BCSans-Italic', Fallback, sans-serif;
  font-size: 12px;
`;

/**
 * Form component of ProjectDraftForm.
 * @param param0 isReadOnly disable editing
 */
const ProjectDraftForm = ({ isReadOnly }: IStepProps) => {
  const [disabled, setDisabled] = useState(isReadOnly);
  return (
    <Container fluid className="ProjectDraftForm">
      <Button disabled={!disabled} className="edit" onClick={() => setDisabled(false)}>
        Edit
      </Button>
      {isReadOnly && <h3>Review</h3>}
      <Form.Row className="col-md-10">
        <Form.Label className="col-md-2">Project No.</Form.Label>
        <Input
          placeholder="SPP-XXXXXX"
          disabled={true}
          field="projectNumber"
          outerClassName="col-md-2"
        />
        {!isReadOnly && <ItalicText className="col-md-7">{projectNoDescription}</ItalicText>}
      </Form.Row>
      <Form.Row>
        <Input
          disabled={disabled}
          field="name"
          label="Name"
          className="col-md-5"
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
      {!isReadOnly && <ProjectNotes />}
    </Container>
  );
};

export default ProjectDraftForm;
