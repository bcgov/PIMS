import variables from '_variables.module.scss';
import { Button, Check, Input, SelectOption } from 'components/common/form';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Form, Formik } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import _ from 'lodash';
import * as React from 'react';
import { Col, Form as BSForm, Row } from 'react-bootstrap';
import { FaFileAlt, FaFileExcel, FaSyncAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { formatApiDateTime, generateUtcNowDateTime } from 'utils';

import { Claims } from '../../../constants/';
import { IReport } from '../interfaces';
import AddReportControl from './AddReportControl';

interface IReportControlsProps {
  /** the active report being displayed, snapshot data is displayed based on this report */
  currentReport?: IReport;
  /** a full list of spl reports in the system */
  reports: IReport[];
  /** the action to take if a report is saved */
  onSave: (report: IReport) => void;
  /** Add a new SPL report */
  onAdd: (report: IReport) => void;
  /** the action to take if a report's 'To' date is updated to the current date/time */
  onRefresh: (report: IReport) => void;
  /** the action to take if a report's 'From' date is updated to point to a different, older spl report. */
  onFromChange: (reportId: number) => void;
  /** the action to take if a user clicks one of the export icons. */
  onExport: (report: IReport, accept: 'csv' | 'excel') => void;
}

/** This object will be used to initialize new spl reports. */
export const defaultReport: IReport = {
  name: '',
  reportTypeId: 0,
  isFinal: false,
  to: generateUtcNowDateTime(),
};

/** get all of the other reports that have a 'To' date before this date */
const getOtherOlderReports = (reports: IReport[], currentReport?: IReport) => {
  return currentReport !== undefined
    ? _.filter(
        reports,
        (report) => !!report.id && report.id !== currentReport.id && currentReport.to > report.to,
      )
    : [];
};

const FileIcon = styled(Button)`
  background-color: white !important;
  color: ${variables.primaryColor} !important;
  padding: 6px 5px;
`;

/**
 * return a list of SelectOptions based on the passed reports, only returning dates older then the current report.
 */
const reportsToOptions = (reports: IReport[]) => {
  const options = _.map(
    reports,
    (report: IReport) =>
      ({
        value: report.id,
        label: report.name?.length ? report.name : formatApiDateTime(report.to),
      }) as SelectOption,
  );
  options.unshift({
    value: '',
    label: 'Choose a report',
    parent: '',
  });
  return options;
};

/**
 * Formik based Report Controls. Maintains independent state from the SplReportContainer. However, the formik container accepts initial state from the SplReportContainer.
 */
const ReportControls: React.FunctionComponent<IReportControlsProps> = ({
  reports,
  currentReport,
  onAdd,
  onSave,
  onRefresh,
  onFromChange,
  onExport,
}) => {
  const otherReports = getOtherOlderReports(reports, currentReport);
  const reportOptions = reportsToOptions(otherReports);
  const reportOn = formatApiDateTime(currentReport?.to);
  const fromId = _.find(reports, { to: currentReport?.from })?.id;
  const originalReport = _.find(reports, { id: currentReport?.id });
  const keycloak = useKeycloakWrapper();
  const isSPLAdmin = keycloak.hasClaim(Claims.REPORTS_SPL_ADMIN);

  return (
    <>
      <Formik
        initialValues={{ ...defaultReport, ...currentReport }}
        onSubmit={(values) => onSave(values)}
        enableReinitialize
      >
        {({ dirty, values, submitForm, setSubmitting }) => (
          <>
            <Form className="report-form m-0 flex-nowrap">
              <AddReportControl onAdd={onAdd} />
              <Row className="d-flex align-items-center g-0">
                {reportOptions.length > 1 ? (
                  <Col md="auto">
                    <Row
                      controlid="select-from"
                      style={{ marginLeft: '10px', display: 'flex', alignItems: 'end' }}
                    >
                      <Col md="auto">
                        <BSForm.Label>From: </BSForm.Label>
                      </Col>
                      <Col md="auto">
                        <BSForm.Control
                          style={{ maxWidth: '200px' }}
                          as="select"
                          value={fromId}
                          disabled={values.isFinal}
                          onChange={(e: any) => onFromChange(+e.target.value)}
                        >
                          {reportOptions.map((option: SelectOption) => (
                            <option key={option.value} value={option.value} className="option">
                              {option.label}
                            </option>
                          ))}
                        </BSForm.Control>
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  <Col md="auto">
                    <BSForm.Label>From: N/A</BSForm.Label>
                  </Col>
                )}
                <Col md="auto">
                  <Row
                    controlid="input-to"
                    style={{ marginLeft: '10px', display: 'flex', alignItems: 'end' }}
                  >
                    <Col md="auto">
                      <BSForm.Label>To:</BSForm.Label>
                    </Col>
                    <Col md="auto">
                      <BSForm.Control
                        style={{ maxWidth: '200px' }}
                        type="input"
                        disabled
                        value={reportOn}
                      ></BSForm.Control>
                    </Col>
                  </Row>
                </Col>
                <Col md="auto" style={{ marginLeft: '5px', marginRight: '5px' }}>
                  <TooltipWrapper
                    toolTipId="spl-reports-regenerate-report"
                    toolTip="Regenerate Report"
                  >
                    <Button
                      type="reset"
                      variant="light"
                      className="mr-3"
                      disabled={values.isFinal}
                      icon={<FaSyncAlt size={20} title="refresh-button" />}
                      onClick={() => currentReport && onRefresh(currentReport)}
                    ></Button>
                  </TooltipWrapper>
                </Col>
                <Col md="auto">
                  <Input label="Name:" field="name" disabled={values.isFinal} />
                </Col>
                <Col md="auto">
                  <TooltipWrapper
                    toolTipId="is-final"
                    toolTip="Mark report as final, no more changes to be made."
                  >
                    <Check label="Is Final:" field="isFinal" disabled={!isSPLAdmin} />
                  </TooltipWrapper>
                </Col>
                <Col md="auto">
                  <Button
                    className="h-75 mr-auto"
                    type="submit"
                    variant="primary"
                    disabled={
                      (!dirty &&
                        originalReport?.to === currentReport?.to &&
                        originalReport?.from === currentReport?.from) ||
                      !values.id
                    }
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSubmitting(true);
                      submitForm();
                    }}
                  >
                    Save
                  </Button>
                </Col>
                <Col md="auto">
                  <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to Excel">
                    <FileIcon>
                      <FaFileExcel
                        size={36}
                        onClick={() => currentReport && onExport(currentReport, 'excel')}
                      />
                    </FileIcon>
                  </TooltipWrapper>
                </Col>
                <Col md="auto">
                  <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to CSV">
                    <FileIcon>
                      <FaFileAlt
                        size={36}
                        onClick={() => currentReport && onExport(currentReport, 'csv')}
                      />
                    </FileIcon>
                  </TooltipWrapper>
                </Col>
              </Row>
            </Form>
            {/*<Prompt
              when={dirty && !isSubmitting}
              message="You have unsaved changes, are you sure you want to leave? Your unsaved changes will be lost."
            />*/}
          </>
        )}
      </Formik>
    </>
  );
};

export default ReportControls;
