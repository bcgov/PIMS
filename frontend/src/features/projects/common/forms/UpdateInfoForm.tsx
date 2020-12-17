import './UpdateInfoForm.scss';
import React, { useState } from 'react';
import { mapLookupCode } from 'utils';
import { useFormikContext, getIn } from 'formik';
import { Form, Select } from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import {
  IStepProps,
  DisposeWorkflowStatus,
  useProject,
  updateInfoMessage,
  tierTooltips,
  riskTooltips,
  IProject,
} from '../../common';
import { PropertyListViewUpdate } from '../components/PropertyListViewUpdate';
import { Container } from 'react-bootstrap';
import ProjectFinancialTable from '../components/ProjectFinancialTable';
import styled from 'styled-components';

interface IUpdateInfoFormProps {
  title?: string;
  showRisk?: boolean;
  goToAddProperties?: Function;
}

const classificationLimitLabels = ['Surplus Active', 'Surplus Encumbered'];

const Tooltip = styled.div`
  padding-left: 10px;
  small {
    padding-top: 20px;
    vertical-align: middle;
  }
`;

/**
 * Return a friendly tooltip for the specified tier level.
 * @param riskId The primary key 'id' of the tier level.
 * @returns A tooltip string.
 */
const getTierLevelTooltip = (riskId: number | string) => {
  switch (parseInt(`${riskId}`)) {
    case 1:
      return tierTooltips.tier1Tooltip;
    case 2:
      return tierTooltips.tier2Tooltip;
    case 3:
      return tierTooltips.tier3Tooltip;
    case 4:
      return tierTooltips.tier4Tooltip;
    default:
      return null;
  }
};

/**
 * Return a friendly tooltip for the specified project risk.
 * @param riskId The primary key 'id' of the project risk.
 * @returns A tooltip string.
 */
const getRiskTooltip = (riskId: number | string) => {
  switch (parseInt(`${riskId}`)) {
    case 1:
      return riskTooltips.risk1Tooltip;
    case 2:
      return riskTooltips.risk2Tooltip;
    case 3:
      return riskTooltips.risk3Tooltip;
    default:
      return null;
  }
};

/**
 * Form component of UpdateInfoForm.
 * @param param0 isReadOnly disable editing
 */
const UpdateInfoForm = ({
  isReadOnly,
  showRisk,
  goToAddProperties,
  title,
}: IStepProps & IUpdateInfoFormProps) => {
  const codeLookups = useCodeLookups();
  const tierCodes = codeLookups.getByType('TierLevel').map(mapLookupCode);
  const riskCodes = codeLookups.getByType('ProjectRisk').map(mapLookupCode);
  const [selectedProperties, setSelectedProperties] = useState([]);

  const { values } = useFormikContext<IProject>();
  const tierLevelTooltip = getTierLevelTooltip(getIn(values, 'tierLevelId'));
  const riskTooltip = getRiskTooltip(getIn(values, 'riskId'));

  return (
    <Container fluid className="UpdateInfoForm">
      {title && (
        <Form.Row style={{ alignItems: 'unset' }}>
          <h3 className="col-md-8">{title}</h3>
        </Form.Row>
      )}
      <Form.Row>
        <Form.Label column md={2}>
          Assign Tier
        </Form.Label>
        <Select
          disabled={isReadOnly}
          outerClassName="col-md-1"
          placeholder="Must Select One"
          field="tierLevelId"
          type="number"
          options={tierCodes}
          required
        />
        <Tooltip>
          <small>{tierLevelTooltip}</small>
        </Tooltip>
      </Form.Row>

      {showRisk && (
        <>
          <Form.Row>
            <Form.Label column md={2}>
              Risk
            </Form.Label>
            <Select
              disabled={isReadOnly}
              outerClassName="col-md-1"
              field="riskId"
              type="number"
              options={riskCodes}
            />
            <Tooltip>
              <small>{riskTooltip}</small>
            </Tooltip>
          </Form.Row>
        </>
      )}

      <ProjectFinancialTable disabled={!!isReadOnly} title="Financial Information" />
      <Form.Row>
        <h6 className="col-md-12" style={{ margin: '1rem 0' }}>
          {updateInfoMessage}
        </h6>
        <h2 className="col-md-5">Properties in the Project</h2>
        <ReviewButtons
          {...{ isReadOnly, selectedProperties, setSelectedProperties, goToAddProperties }}
        />
      </Form.Row>

      <PropertyListViewUpdate
        field="properties"
        disabled={isReadOnly}
        setSelectedRows={!isReadOnly ? setSelectedProperties : undefined}
        editableClassification
        editableFinancials
        editableZoning
        classificationLimitLabels={classificationLimitLabels}
      ></PropertyListViewUpdate>
    </Container>
  );
};

/**
 * ReviewButtons subcomponent, optionally displayed buttons that allow a user to update read-only property information.
 */
const ReviewButtons = ({
  isReadOnly,
  selectedProperties,
  setSelectedProperties,
  goToAddProperties,
}: any) => {
  const { goToStepByCode } = useProject();
  const { setFieldValue, values } = useFormikContext();

  return !isReadOnly ? (
    <div className="review-buttons col-md-7">
      <Button
        variant="secondary"
        onClick={() => {
          goToAddProperties
            ? goToAddProperties()
            : goToStepByCode(DisposeWorkflowStatus.SelectProperties);
        }}
      >
        Add More Properties
      </Button>
      <Button
        onClick={() => {
          setFieldValue(
            'properties',
            _.difference(getIn(values, 'properties'), selectedProperties),
          );
          setSelectedProperties([]);
        }}
      >
        Remove Properties
      </Button>
    </div>
  ) : null;
};

export default UpdateInfoForm;
