import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { ProjectDraftForm, ProjectNotes, IProject, PublicNotes, PrivateNotes } from '../../common';
import { PropertyListViewUpdate } from '../../common/components/PropertyListViewUpdate';
import { AutoCompleteText } from 'components/common/form';
import { useFormikContext } from 'formik';
import useCodeLookups from 'hooks/useLookupCodes';
import _ from 'lodash';
import { ILookupCode } from 'actions/lookupActions';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as API from 'constants/API';

/**
 * Form component of GreTransferStep.
 * @param param0 isReadOnly disable editing
 */
const GreTransferForm = ({ canEdit }: { canEdit: boolean }) => {
  /** Enter edit mode if allowed and there are errors to display */
  const { values, setFieldValue, touched } = useFormikContext<IProject>();
  const agencyOptions = useCodeLookups().getOptionsByType('Agency');
  const [initialAgencyId] = useState(values.agencyId);
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = useMemo(
    () =>
      _.filter(lookupCodes, (lookupCode: ILookupCode) => {
        return lookupCode.type === API.AGENCY_CODE_SET_NAME;
      }),
    [lookupCodes],
  );
  useEffect(() => {
    values.properties.forEach((property, index) => {
      if (!isNaN(values.agencyId) && values.agencyId !== initialAgencyId) {
        setFieldValue(`properties.${index}.agencyId`, values.agencyId);
        const agency = _.find(agencies, { id: values.agencyId }) as ILookupCode;
        if (agency !== undefined) {
          setFieldValue(`properties.${index}.agencyCode`, agency.code);
          setFieldValue(`properties.${index}.subAgency`, agency.name);
        }
      }
    });
  }, [setFieldValue, values.properties, values.agencyId, agencies, touched, initialAgencyId]);
  // const agencies = useCodeLookups().getByType('Agency');
  // const agency: ILookupCode = _.find(agencies, { id: values.agencyId }) as ILookupCode;
  return (
    <Fragment>
      <ProjectDraftForm isReadOnly={true} />
      <h3>Properties in the Project</h3>
      <p>Update Properties with New Agency Owner Name</p>
      <Form.Row>
        <Form.Label column md={2} htmlFor="input-agencyId">
          New Owning Agency
        </Form.Label>
        <AutoCompleteText
          autoSetting="new-password"
          field="agencyId"
          options={agencyOptions}
          disabled={!canEdit}
          required={true}
        />
      </Form.Row>
      <PropertyListViewUpdate
        disabled={!canEdit}
        field="properties"
        editableClassification
        classificationLimitLabels={['Core Strategic', 'Core Operational']}
      />
      <ProjectNotes outerClassName="col-md-12" disabled={true} />
      <PublicNotes outerClassName="col-md-12" disabled={!canEdit} />
      <PrivateNotes outerClassName="col-md-12" disabled={!canEdit} />
    </Fragment>
  );
};

export default GreTransferForm;
