import './UpdateInfoForm.scss';
import React, { useState } from 'react';
import { mapLookupCode } from 'utils';
import { useFormikContext, getIn } from 'formik';
import { Form, Select } from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import { IStepProps, ProjectNotes, useStepper, DisposeWorkflowStatus } from '..';
import { PropertyListViewUpdate } from '../components/PropertyListViewUpdate';
import TooltipIcon from 'components/common/TooltipIcon';
import { updateInfoMessage, tierTooltip } from '../strings';
import { Container } from 'react-bootstrap';

interface IUpdateInfoFormProps {
  setIsReadOnly?: Function;
  title?: string;
}

/**
 * Form component of UpdateInfoForm.
 * @param param0 isReadOnly disable editing
 */
const UpdateInfoForm = ({
  isReadOnly,
  canEdit,
  setIsReadOnly,
  title,
}: IStepProps & IUpdateInfoFormProps) => {
  const codeLookups = useCodeLookups();
  const tierCodes = codeLookups.getByType('TierLevel').map(mapLookupCode);
  const [selectedProperties, setSelectedProperties] = useState([]);

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
          <span className="required">*</span>
          <TooltipIcon toolTipId="tier-info" toolTip={tierTooltip} placement="right" />
        </Form.Label>

        <Select
          disabled={isReadOnly}
          outerClassName="col-md-2"
          placeholder="Must Select One"
          field="tierLevelId"
          type="number"
          options={tierCodes}
        />
      </Form.Row>

      <Form.Row>
        <h6 className="col-md-12" style={{ margin: '1rem 0' }}>
          {updateInfoMessage}
        </h6>
        <h2 className="col-md-5">Properties in the Project</h2>
        <ReviewButtons {...{ isReadOnly, selectedProperties, setSelectedProperties }} />
      </Form.Row>

      <PropertyListViewUpdate
        field="properties"
        disabled={isReadOnly}
        setSelectedRows={!isReadOnly ? setSelectedProperties : undefined}
      ></PropertyListViewUpdate>
      {!isReadOnly && <ProjectNotes />}
    </Container>
  );
};

/**
 * ReviewButtons subcomponent, optionally displayed buttons that allow a user to update read-only property information.
 */
const ReviewButtons = ({ isReadOnly, selectedProperties, setSelectedProperties }: any) => {
  const { goToStep } = useStepper();
  const { setFieldValue, values } = useFormikContext();

  return !isReadOnly ? (
    <div className="review-buttons col-md-7">
      <Button variant="secondary" onClick={() => goToStep(DisposeWorkflowStatus.SelectProperties)}>
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
