import './SelectProjectPropertiesStep.scss';

import React, { useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { Formik } from 'formik';
import { useStepper, SelectProjectPropertiesStepYupSchema } from '..';
import {
  FilterBar,
  IFilterBarState,
  IStepProps,
  useStepForm,
  SelectProjectPropertiesForm,
} from '../../common';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import * as API from 'constants/API';
import _ from 'lodash';
import useCodeLookups from 'hooks/useLookupCodes';

/**
 * Form to display two property list views, one for searching/selecting and one to show
 * the current list of properties associated to the project.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const SelectProjectPropertiesStep = ({ isReadOnly, formikRef }: IStepProps) => {
  // Filtering and pagination state
  const [filter, setFilter] = useState<IFilterBarState>({
    searchBy: 'address',
    pid: '',
    address: '',
    administrativeArea: '',
    projectNumber: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
  });
  const [pageIndex, setPageIndex] = useState(0);
  const { onSubmit, canUserEditForm } = useStepForm();
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
  const filterByParent = useCodeLookups().filterByParent;
  const filteredAgencies: ILookupCode[] = useMemo(
    () => filterByParent(agencies, project.agencyId),
    [agencies, filterByParent, project.agencyId],
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
      <h3 className="mr-auto">Search and select 1 or more properties for the project</h3>
      {!isReadOnly && (
        <Container fluid className="filter-container border-bottom">
          <Container className="px-0">
            <FilterBar
              agencyLookupCodes={filteredAgencies}
              propertyClassifications={propertyClassifications}
              onChange={handleFilterChange}
            />
          </Container>
        </Container>
      )}
      <Formik
        initialValues={project}
        innerRef={formikRef}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        validationSchema={SelectProjectPropertiesStepYupSchema}
        enableReinitialize={true}
      >
        <SelectProjectPropertiesForm
          {...{
            pageIndex,
            setPageIndex,
            filter,
            isReadOnly: isReadOnly || !canUserEditForm(project.agencyId),
          }}
        />
      </Formik>
    </Container>
  );
};

export default SelectProjectPropertiesStep;
