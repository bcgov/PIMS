import React, { Fragment } from 'react';
import { mapLookupCode } from 'utils';
import { useFormikContext } from 'formik';
import { Form, TextArea, FastSelect } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { PropertyListViewUpdate } from '../PropertyListViewUpdate';
import useCodeLookups from 'hooks/useLookupCodes';

/**
 * Form component of UpdateInfoForm.
 * @param param0 isReadOnly disable editing
 */
const UpdateInfoForm = ({ isReadOnly }: IStepProps) => {
  const codeLookups = useCodeLookups();
  const formikProps = useFormikContext();
  const tierCodes = codeLookups.getByType('TierLevel').map(mapLookupCode);

  return (
    <Fragment>
      <h3>Properties in the Project</h3>
      <Form.Row>
        <Form.Label column md={2}>
          Tier
        </Form.Label>
        <FastSelect
          formikProps={formikProps}
          outerClassName="col-md-2"
          placeholder="Must Select One"
          field="tierLevelId"
          type="number"
          options={tierCodes}
        />
      </Form.Row>
      <PropertyListViewUpdate field="properties" disabled={isReadOnly}></PropertyListViewUpdate>
      {!isReadOnly && (
        <Form.Row>
          <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
            Notes:
          </Form.Label>
          <TextArea outerClassName="col-md-8" field="note" />
        </Form.Row>
      )}
    </Fragment>
  );
};

export default UpdateInfoForm;
