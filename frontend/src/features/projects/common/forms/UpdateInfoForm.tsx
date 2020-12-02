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
  tier1Tooltip,
  tier2Tooltip,
  tier3Tooltip,
  tier4Tooltip,
  risk1Tooltip,
  risk2Tooltip,
  risk3Tooltip,
  risk4Tooltip,
} from '../../common';
import { PropertyListViewUpdate } from '../components/PropertyListViewUpdate';
import { Container } from 'react-bootstrap';
import ProjectFinancialTable from '../components/ProjectFinancialTable';

interface IUpdateInfoFormProps {
  title?: string;
  showRisk?: boolean;
  goToAddProperties?: Function;
}

const classificationLimitLabels = ['Surplus Active', 'Surplus Encumbered'];

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
  const [selectedProperties, setSelectedProperties] = useState([]);
  const risks = [
    { value: 1, label: 'Complete' },
    { value: 2, label: 'Green' },
    { value: 3, label: 'Yellow' },
    { value: 4, label: 'Red' },
  ];

  return (
    <Container fluid className="UpdateInfoForm">
      {title && (
        <Form.Row style={{ alignItems: 'unset' }}>
          <h3 className="col-md-8">{title}</h3>
        </Form.Row>
      )}
      <Form.Row>
        <Form.Label column md={2}>
          Assign Tier&nbsp;
        </Form.Label>
        <Select
          disabled={isReadOnly}
          outerClassName="col-md-2"
          placeholder="Must Select One"
          field="tierLevelId"
          type="number"
          options={tierCodes}
          required
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={2}></Form.Label>
        <Form.Group>
          <div>
            <small>{tier1Tooltip}</small>
          </div>
          <div>
            <small>{tier2Tooltip}</small>
          </div>
          <div>
            <small>{tier3Tooltip}</small>
          </div>
          <div>
            <small>{tier4Tooltip}</small>
          </div>
        </Form.Group>
      </Form.Row>

      {showRisk && (
        <>
          <Form.Row>
            <Form.Label column md={2}>
              Risk
            </Form.Label>
            <Select
              disabled={isReadOnly}
              outerClassName="col-md-2"
              field="riskId"
              type="number"
              options={risks}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}></Form.Label>
            <Form.Group>
              <div>
                <small>{risk1Tooltip}</small>
              </div>
              <div>
                <small>{risk2Tooltip}</small>
              </div>
              <div>
                <small>{risk3Tooltip}</small>
              </div>
              <div>
                <small>{risk4Tooltip}</small>
              </div>
            </Form.Group>
          </Form.Row>
        </>
      )}

      <ProjectFinancialTable disabled={!!isReadOnly} label="Financial Information" />
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
