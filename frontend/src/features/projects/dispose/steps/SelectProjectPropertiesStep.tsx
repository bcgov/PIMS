import './SelectProjectProperties.scss';

import React, { useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { Formik } from 'formik';
import { Form, TextArea } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { PropertyListViewSelect } from '../PropertyListViewSelect';
import useStepForm from './useStepForm';
import { FilterBar, IFilterBarState } from '..';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as API from 'constants/API';
import _ from 'lodash';
import useStepper from '../hooks/useStepper';
import StepErrorSummary from './StepErrorSummary';

/**
 * Form to display two property list views, one for searching/selecting and one to show
 * the current list of properties associated to the project.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const SelectProjectPropertiesStep = ({ isReadOnly, formikRef }: IStepProps) => {
  // Filtering and pagination state
  const [filter, setFilter] = useState<IFilterBarState>({
    searchBy: 'address',
    address: '',
    municipality: '',
    projectNumber: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
  });
  const [pageIndex, setPageIndex] = useState(0);
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
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
  const propertyClassifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME;
  });

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    async (value: IFilterBarState) => {
      setFilter({ ...value });
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex],
  );

  return isReadOnly ? null : (
    <Container fluid className="SelectProjectProperties">
      {!isReadOnly && (
        <Container fluid className="filter-container border-bottom">
          <Container className="px-0">
            <FilterBar
              agencyLookupCodes={agencies}
              propertyClassifications={propertyClassifications}
              onChange={handleFilterChange}
            />
          </Container>
        </Container>
      )}
      <Formik initialValues={project} innerRef={formikRef} onSubmit={onSubmit}>
        {() => (
          <Form>
            <PropertyListViewSelect
              filter={filter}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              field="properties"
            />
            <Form.Row>
              <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
                Notes:
              </Form.Label>
              <TextArea outerClassName="col-md-8" field="note" />
            </Form.Row>
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SelectProjectPropertiesStep;
