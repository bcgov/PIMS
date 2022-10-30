import { ILookupCode } from 'actions/ILookupCode';
import { TypeaheadField } from 'components/common/form/Typeahead';
import * as API from 'constants/API';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useCodeLookups from 'hooks/useLookupCodes';
import _ from 'lodash';
import React, { Fragment, useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { PrivateNotes, ProjectDraftForm, ProjectNotes, PublicNotes } from '../../common';
import { PropertyListViewUpdate } from '../../common/components/PropertyListViewUpdate';

/**
 * Form component of GreTransferStep.
 * @param param0 isReadOnly disable editing
 */
export const GreTransferForm = ({ canEdit }: { canEdit: boolean }) => {
  /** Enter edit mode if allowed and there are errors to display */
  const lookupCodes = useCodeLookups();
  const { values, setFieldValue, touched } = useFormikContext<IProject>();
  const [initialAgencyId] = useState(values.agencyId);
  const agencies = useMemo(() => lookupCodes.getByType(API.AGENCY_CODE_SET_NAME), [lookupCodes]);
  const agencyOptions = lookupCodes.getOptionsByType(API.AGENCY_CODE_SET_NAME);
  useDeepCompareEffect(() => {
    values.properties?.forEach((property, index) => {
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
  return (
    <Fragment>
      <ProjectDraftForm isReadOnly={canEdit} hideAgency={true} />
      <h3>Properties in the Project</h3>
      <p>Update Properties with New Agency Owner Name</p>
      <Row>
        <Form.Label column md={2} htmlFor="agencyId-field">
          New Owning Agency
        </Form.Label>
        <Col md="auto">
          <TypeaheadField
            data-testid="transfer-to-agency"
            options={agencyOptions}
            name="agencyId"
            labelKey="label"
            paginate={false}
            required
            getOptionByValue={(value: number) => {
              const options = _.filter(agencyOptions, { value: value?.toString() }) ?? [];
              return options;
            }}
          />
        </Col>
      </Row>
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
