import { Col, Row } from 'components/flex';
import { Table } from 'components/Table';
import { ProjectLayout } from 'features/projects/common';
import { LayoutWrapper } from 'features/routes';
import { IProjectModel, IProjectPropertyModel } from 'hooks/api/projects/disposals';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectDisposal } from 'store/hooks';
import { formatDate, formatFiscalYear, formatMoney } from 'utils';

import { PropertyColumns } from './constants';
import * as styled from './styled';

export const ProjectSummary: React.FC = () => {
  const navigate = useNavigate();
  const api = useProjectDisposal();
  const [project, setProject] = React.useState<IProjectModel>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let projectNumber: string | null | undefined = queryParams.get('projectNumber');
  if (projectNumber === '') projectNumber = undefined;
  const properties = project?.properties ?? [];

  const fetch = React.useCallback(
    async (projectNumber: string) => {
      try {
        const response = await api.get(projectNumber);
        if (response?.data) {
          setProject(response.data);
        }
      } catch (error) {
        console.error(error); // TODO: Handle error.
      }
    },
    [api],
  );

  React.useEffect(() => {
    if (!!projectNumber && project?.projectNumber !== projectNumber) {
      fetch(projectNumber);
    }
  }, [projectNumber, fetch, project?.projectNumber]);

  const handleRowClick = React.useCallback(
    (row: IProjectPropertyModel) => {
      const queryParams = new URLSearchParams();
      queryParams.set('sidebar', 'true');
      queryParams.set('disabled', 'true');
      queryParams.set('loadDraft', 'false');
      queryParams.set('buildingId', `${row.buildingId}`);
      queryParams.set('parcelId', `${row.parcelId}`);
      navigate({
        pathname: '/mapview',
        search: '',
      });
    },
    [navigate],
  );

  const ProjectSummaryContent = () => {
    return (
      <styled.ProjectSummary>
        <h2>{project?.status?.name}</h2>
        <Row className="section">
          <Col flex="1">
            <Form.Group>
              <label>Project No.:</label>
              <span>{project?.projectNumber}</span>
            </Form.Group>
            <Form.Group>
              <label>Name:</label>
              <span>{project?.name}</span>
            </Form.Group>
          </Col>
          <Col flex="1">
            <Form.Group className="col">
              <label>Description:</label>
              <span>{project?.description}</span>
            </Form.Group>
          </Col>
        </Row>
        <Row className="section">
          <Col flex="1">
            <Form.Group>
              <label>Created On:</label>
              <span>{formatDate(project?.createdOn)}</span>
            </Form.Group>
            <Form.Group>
              <label>Reported Fiscal Year:</label>
              <span>{formatFiscalYear(project?.reportedFiscalYear)}</span>
            </Form.Group>
            <Form.Group>
              <label>Actual Fiscal Year:</label>
              <span>{formatFiscalYear(project?.actualFiscalYear)}</span>
            </Form.Group>
          </Col>
          <Col flex="1">
            {project?.cancelledOn && (
              <Form.Group>
                <label>Cancelled On:</label>
                <span>{formatDate(project?.cancelledOn)}</span>
                <div>
                  <i>Review SRES notes below</i>
                </div>
              </Form.Group>
            )}
            {project?.deniedOn && (
              <Form.Group>
                <label>Denied On:</label>
                <span>{formatDate(project?.deniedOn)}</span>
                <div>
                  <i>Review SRES notes below</i>
                </div>
              </Form.Group>
            )}
            {project?.approvedOn && (
              <Form.Group>
                <label>Approved On:</label>
                <span>{formatDate(project?.approvedOn)}</span>
              </Form.Group>
            )}
            {project?.approvedForSplOn && (
              <Form.Group>
                <label>Approved for SPL On:</label>
                <span>{formatDate(project?.approvedForSplOn)}</span>
              </Form.Group>
            )}
          </Col>
        </Row>
        <Row className="section">
          <Col flex="1">
            <Form.Group>
              <label>Tier:</label>
              <span>{project?.tierLevel}</span>
            </Form.Group>
          </Col>
          <Col flex="1">
            <Form.Group>
              <label>Risk:</label>
              <span>{project?.risk}</span>
            </Form.Group>
          </Col>
        </Row>
        <Row className="section">
          <Col flex="1">
            <Form.Group className="col right">
              <label>Assessed Value:</label>
              <span>{formatMoney(project?.assessed)}</span>
            </Form.Group>
            <Form.Group className="col right">
              <label>Net Book Value:</label>
              <span>{formatMoney(project?.netBook)}</span>
            </Form.Group>
          </Col>
          <Col flex="1">
            <Form.Group className="col right">
              <label>Estimated Market Value:</label>
              <span>{formatMoney(project?.market)}</span>
            </Form.Group>
            <Form.Group className="col right">
              <label>Appraised Value:</label>
              <span>{formatMoney(project?.appraised)}</span>
            </Form.Group>
          </Col>
          <Col flex="1">
            <Form.Group className="col right">
              <label>Estimated Sales Cost:</label>
              <span>{formatMoney(project?.salesCost)}</span>
            </Form.Group>
            <Form.Group className="col right">
              <label>Estimated Program Recovery Fees:</label>
              <span>{formatMoney(project?.programCost)}</span>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Table<IProjectPropertyModel, any>
            name="properties"
            columns={PropertyColumns()}
            data={properties}
            footer={false}
            onRowClick={handleRowClick}
          />
        </Row>
        <Col className="note" rowGap="0">
          <label>Your Notes</label>
          <textarea disabled value={project?.note} />
        </Col>
        <Col className="note" rowGap="0">
          <label>SRES Notes</label>
          <textarea disabled value={project?.publicNote} />
        </Col>
        <Col className="note" rowGap="0">
          <label>Reporting</label>
          <textarea disabled value={project?.reportingNote} />
        </Col>
      </styled.ProjectSummary>
    );
  };

  return (
    <LayoutWrapper
      component={ProjectSummaryContent}
      layout={ProjectLayout}
      title={'PIMS - Dispose Property'}
    />
  );
};
