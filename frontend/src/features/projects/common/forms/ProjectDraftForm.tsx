import './ProjectDraftForm.scss';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Form, Input, TextArea } from 'components/common/form';
import { IStepProps, projectNoDescription, EditButton } from '..';
import styled from 'styled-components';

const ItalicText = styled.div`
  font-family: 'BCSans-Italic', Fallback, sans-serif;
  font-size: 12px;
`;

interface IProjectDraftFormProps {
  setIsReadOnly?: Function;
  title?: string;
}

/**
 * Form component of ProjectDraftForm.
 * @param param0 isReadOnly disable editing
 */
const ProjectDraftForm = ({
  isReadOnly,
  title,
  setIsReadOnly,
}: IStepProps & IProjectDraftFormProps) => {
  return (
    <Container fluid className="ProjectDraftForm">
      <Form.Row>
        <h3 className="col-md-8">{title ?? 'Review'}</h3>
        <span className="col-md-4">
          <EditButton {...{ formDisabled: isReadOnly, setFormDisabled: setIsReadOnly }} />
        </span>
      </Form.Row>
      <Form.Row className="col-md-10">
        <Form.Label className="col-md-2">Project No.</Form.Label>
        <Input
          placeholder="SPP-XXXXXX"
          disabled={true}
          field="projectNumber"
          outerClassName="col-md-2"
        />
        {isReadOnly === undefined && (
          <ItalicText className="col-md-7">{projectNoDescription}</ItalicText>
        )}
      </Form.Row>
      <Form.Row>
        <Input
          disabled={isReadOnly}
          field="name"
          label="Name"
          className="col-md-5"
          outerClassName="col-md-10"
          required
        />
      </Form.Row>
      <Form.Row>
        <TextArea
          disabled={isReadOnly}
          field="description"
          label="Description"
          className="col-md-5"
          outerClassName="col-md-10"
        />
      </Form.Row>
    </Container>
  );
};

export default ProjectDraftForm;
