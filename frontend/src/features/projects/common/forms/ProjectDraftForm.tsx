import './ProjectDraftForm.scss';

import { Form, Input, TextArea } from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import * as API from 'constants/API';
import { Claims } from 'constants/claims';
import { IStepProps } from 'features/projects/interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { useMyAgencies } from 'hooks/useMyAgencies';
import React, { useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { mapSelectOptionWithParent } from 'utils';

import { EditButton, projectNoDescription } from '..';

const ItalicText = styled.div`
  font-family: 'BCSans-Italic', Fallback, sans-serif;
  font-size: 12px;
`;

const AgencyCol = styled(Col)`
  display: flex;
  .form-group {
    width: 100%;
    .rbt {
      width: 100%;
      div {
        input {
          width: 100% !important;
        }
      }
      .rbt-menu {
        width: 370px !important;
      }
    }
  }
`;

interface IProjectDraftFormProps {
  hideAgency?: boolean;
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
  hideAgency,
}: IStepProps & IProjectDraftFormProps) => {
  const { getOptionsByType } = useCodeLookups();
  const keycloak = useKeycloakWrapper();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const userAgency = agencies.find((a) => Number(a.value) === Number(keycloak.agencyId));

  const isUserAgencyAParent = useMemo(() => {
    return !!userAgency && !userAgency.parentId;
  }, [userAgency]);

  const isSRES = useMemo(() => {
    return (
      keycloak.hasClaim(Claims.PROJECT_VIEW) ||
      keycloak.hasClaim(Claims.DISPOSE_APPROVE) ||
      keycloak.hasClaim(Claims.ADMIN_PROJECTS)
    );
  }, [keycloak]);

  const myAgencies = useMyAgencies();

  return (
    <Container fluid className="ProjectDraftForm" data-testid="disposal-projects-draft-form">
      <Row>
        <h3 className="col-md-8">{title ?? 'Review'}</h3>
        <span className="col-md-4">
          <EditButton {...{ formDisabled: isReadOnly, setFormDisabled: setIsReadOnly }} />
        </span>
      </Row>
      <Row className="align-items-center" style={{ marginBottom: '5px' }}>
        <Form.Label>Project No.</Form.Label>
        <Col xs={5}>
          <Input
            data-testid="project-number"
            style={{ width: '200px' }}
            placeholder="SPP-XXXXXX"
            disabled={true}
            field="projectNumber"
            outerClassName="col-md-2"
          />
        </Col>
        {isReadOnly === undefined && (
          <ItalicText className="col-md-7">{projectNoDescription}</ItalicText>
        )}
      </Row>
      <Row className="align-items-center" style={{ marginBottom: '5px' }}>
        <Form.Label>Name</Form.Label>
        <Col xs={5}>
          <Input data-testid="project-name" disabled={isReadOnly} field="name" required />
        </Col>
      </Row>
      {(isSRES || isUserAgencyAParent) && !hideAgency && (
        <Row className="align-items-center" style={{ marginBottom: '5px' }}>
          <Form.Label>Project Agency</Form.Label>
          <AgencyCol className="col-md-5">
            <ParentSelect
              field={'agencyId'}
              options={myAgencies.map((c) => mapSelectOptionWithParent(c, myAgencies))}
              filterBy={['code', 'label', 'parent']}
              convertValue={Number}
            />
          </AgencyCol>
        </Row>
      )}
      <Row style={{ marginBottom: '5px' }}>
        <Form.Label>Description</Form.Label>
        <Col md="auto">
          <TextArea
            style={{ width: '500px' }}
            data-testid="project-description"
            disabled={isReadOnly}
            field="description"
            className="col-md-auto"
            outerClassName="col-md-10"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDraftForm;
