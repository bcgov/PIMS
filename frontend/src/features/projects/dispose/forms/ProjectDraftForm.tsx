import './ProjectDraftForm.scss';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Form, Input } from 'components/common/form';
import { IStepProps, ProjectNotes, projectNoDescription, EditButton } from '..';
import styled from 'styled-components';

const ItalicText = styled.div`
  font-family: 'BCSans-Italic', Fallback, sans-serif;
  font-size: 12px;
`;

/**
 * Form component of ProjectDraftForm.
 * @param param0 isReadOnly disable editing
 */
const ProjectDraftForm = ({ isReadOnly, canEdit }: IStepProps) => {
  const [disabled, setDisabled] = useState(isReadOnly);
  return (
    <Container fluid className="ProjectDraftForm">
      <EditButton {...{ formDisabled: disabled, setFormDisabled: setDisabled, canEdit }} />
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
