import './ProjectDraftForm.scss';
import React, { useMemo } from 'react';
import { Col, Container } from 'react-bootstrap';
import { Form, Input, TextArea } from 'components/common/form';
import { IStepProps, projectNoDescription, EditButton } from '..';
import styled from 'styled-components';
import useCodeLookups from 'hooks/useLookupCodes';
import * as API from 'constants/API';
import { ParentSelect } from 'components/common/form/ParentSelect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { mapSelectOptionWithParent } from 'utils';
import { useMyAgencies } from 'hooks/useMyAgencies';
import { Claims } from 'constants/claims';

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
  const { getOptionsByType } = useCodeLookups();
  const keycloak = useKeycloakWrapper();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  const userAgency = agencies.find(a => Number(a.value) === Number(keycloak.agencyId));

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
          data-testid="project-name"
          disabled={isReadOnly}
          field="name"
          label="Name"
          className="col-md-5"
          outerClassName="col-md-10"
          required
        />
      </Form.Row>
      {(isSRES || isUserAgencyAParent) && (
        <Form.Row className="col-md-10">
          <Form.Label className="col-md-1">Project Agency</Form.Label>
          <AgencyCol className="col-md-5">
            <ParentSelect
              field={'agencyId'}
              options={myAgencies.map(c => mapSelectOptionWithParent(c, myAgencies))}
              filterBy={['code', 'label', 'parent']}
              convertValue={Number}
            />
          </AgencyCol>
        </Form.Row>
      )}
      <Form.Row>
        <TextArea
          data-testid="project-description"
          disabled={isReadOnly}
          field="description"
          label="Description"
          className="col-md-auto"
          outerClassName="col-md-10"
        />
      </Form.Row>
    </Container>
  );
};

export default ProjectDraftForm;
