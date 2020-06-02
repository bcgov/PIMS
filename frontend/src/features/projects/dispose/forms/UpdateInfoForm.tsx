import React, { Fragment, useState } from 'react';
import { mapLookupCode } from 'utils';
import { useFormikContext, getIn } from 'formik';
import { Form, Select } from 'components/common/form';
import useCodeLookups from 'hooks/useLookupCodes';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import { IStepProps, ProjectNotes, useStepper, DisposeWorkflowStatus } from '..';
import { PropertyListViewUpdate } from '../components/PropertyListViewUpdate';

/**
 * Form component of UpdateInfoForm.
 * @param param0 isReadOnly disable editing
 */
const UpdateInfoForm = ({ isReadOnly }: IStepProps) => {
  const codeLookups = useCodeLookups();
  const tierCodes = codeLookups.getByType('TierLevel').map(mapLookupCode);
  const [disabled, setDisabled] = useState(isReadOnly);
  const [selectedProperties, setSelectedProperties] = useState([]);

  return (
    <Fragment>
      <Form.Row>
        <h3 className="col-md-10">Properties in the Project</h3>
        <span className="col-md-2">
          <Button className="edit" disabled={!disabled} onClick={() => setDisabled(false)}>
            Edit
          </Button>
        </span>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={1}>
          Tier
        </Form.Label>
        <Select
          disabled={disabled}
          outerClassName="col-md-2"
          placeholder="Must Select One"
          field="tierLevelId"
          type="number"
          options={tierCodes}
        />
        <ReviewButtons {...{ disabled, isReadOnly, selectedProperties, setSelectedProperties }} />
      </Form.Row>

      <PropertyListViewUpdate
        field="properties"
        disabled={disabled}
        setSelectedRows={isReadOnly && !disabled ? setSelectedProperties : undefined}
      ></PropertyListViewUpdate>
      {!isReadOnly && <ProjectNotes />}
    </Fragment>
  );
};

/**
 * ReviewButtons subcomponent, optionally displayed buttons that allow a user to update read-only property information.
 */
const ReviewButtons = ({
  disabled,
  isReadOnly,
  selectedProperties,
  setSelectedProperties,
}: any) => {
  const { goToStep } = useStepper();
  const { setFieldValue, values } = useFormikContext();

  return isReadOnly && !disabled ? (
    <div className="review-buttons col-md-9">
      <Button onClick={() => goToStep(DisposeWorkflowStatus.SelectProperties)}>
        Add Properties
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
