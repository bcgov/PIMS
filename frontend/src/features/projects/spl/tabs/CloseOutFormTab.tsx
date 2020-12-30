import * as React from 'react';
import {
  CloseOutFinancialsForm,
  CloseOutSummaryForm,
  CloseOutPurchaseInformationForm,
  CloseOutSaleInformationForm,
  CloseOutFinancialSummaryForm,
  CloseOutSignaturesForm,
  CloseOutAdjustmentForm,
} from '..';
import { ProjectNotes, projectComments, IProject } from 'features/projects/common';
import { Col, Container, Form } from 'react-bootstrap';
import './CloseOutFormTab.scss';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

interface ICloseOutFormTabProps {
  isReadOnly?: boolean;
}

/**
 * Close out form tab.
 * @param param0 ICloseOutFormTabProps
 */
const CloseOutFormTab: React.FunctionComponent<ICloseOutFormTabProps> = ({
  isReadOnly,
}: ICloseOutFormTabProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Container fluid>
      <CloseOutSummaryForm isReadOnly={isReadOnly} />
      <CloseOutPurchaseInformationForm isReadOnly={isReadOnly} />
      <CloseOutSaleInformationForm isReadOnly={isReadOnly} />
      <CloseOutFinancialSummaryForm isReadOnly={isReadOnly} />
      <CloseOutFinancialsForm isReadOnly={isReadOnly} />
      <Form.Row>
        <Col>
          <ProjectNotes
            field="salesHistoryNote"
            label="Sales History Notes"
            className="col-md-10"
            outerClassName="col"
            disabled={isReadOnly}
          />
        </Col>
        <Col md={1}></Col>
        <Col>
          <ProjectNotes
            field="comments"
            label="Project Comments"
            className="col-md-10"
            outerClassName="col"
            tooltip={projectComments}
            disabled={isReadOnly}
          />
        </Col>
      </Form.Row>
      <h3>OCG</h3>
      <Form.Row className="col-md-12">
        <Form.Label column md={2}>
          OCG Gain / Loss
        </Form.Label>
        <FastCurrencyInput
          formikProps={formikProps}
          disabled={isReadOnly}
          outerClassName="col-md-4"
          field="ocgFinancialStatement"
        />
      </Form.Row>
      <CloseOutSignaturesForm isReadOnly={isReadOnly} />
      <CloseOutAdjustmentForm isReadOnly={isReadOnly} />
    </Container>
  );
};

export default CloseOutFormTab;
