import './SelectProjectPropertiesStep.scss';

import React, { useCallback, useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { useStepper, SelectProjectPropertiesStepYupSchema } from '..';
import {
  FilterBar,
  IFilterBarState,
  IStepProps,
  useStepForm,
  SelectProjectPropertiesForm,
} from '../../common';
import styled from 'styled-components';
import { Classifications } from 'constants/classifications';

/** contains the link text for Show Surplus and Show All classification filter */
const LinkButton = styled(Button)`
  margin-left: 0.5rem;
  margin-bottom: 0.2rem;
`;
/**
 * Form to display two property list views, one for searching/selecting and one to show
 * the current list of properties associated to the project.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const SelectProjectPropertiesStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { project } = useStepper();
  // Filtering and pagination state
  const [filter, setFilter] = useState<IFilterBarState>({
    searchBy: 'address',
    pid: '',
    address: '',
    administrativeArea: '',
    projectNumber: '',
    agencies: project.agencyId,
    classificationId: Classifications.SurplusActive.toString(),
    minLotSize: '',
    maxLotSize: '',
  });
  const [selected, setSelected] = useState({ option: '', selected: false });

  useEffect(() => {
    if (filter.classificationId === Classifications.SurplusActive.toString()) {
      setSelected({ option: 'Surplus Only', selected: true });
    } else {
      setSelected({ option: 'All', selected: true });
    }
  }, [filter]);
  const [pageIndex, setPageIndex] = useState(0);
  const { onSubmit, canUserEditForm } = useStepForm();

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    async (value: IFilterBarState) => {
      setFilter({ ...value });
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex],
  );

  // Update filter to only show Surplus Active when clicked
  const handleShowSurplusClick = () => {
    setFilter({ ...filter, classificationId: Classifications.SurplusActive.toString() });
  };

  // Update filter to clear the classificationId when clicked
  const handleShowAllClick = () => {
    setFilter({
      ...filter,
      classificationId:
        filter.classificationId &&
        filter.classificationId !== Classifications.SurplusActive.toString()
          ? filter.classificationId
          : '',
    });
  };

  // Check which option is seleceted for the smaller filter to keep track of which to shade the darker blue
  const checkSelected = (option: string) => {
    if (selected.option === option && selected.selected) {
      return true;
    }
  };

  return isReadOnly ? null : (
    <Container fluid className="SelectProjectProperties">
      <h3 className="mr-auto">Search and select 1 or more properties for the project</h3>
      {!isReadOnly && (
        <>
          <Container fluid className="filter-container border-bottom">
            <Container className="px-0">
              <FilterBar defaultFilter={filter} onChange={handleFilterChange} />
            </Container>
          </Container>
          <div className="small-filter">
            <p style={{ float: 'right' }}>
              Show{' '}
              <LinkButton
                onClick={handleShowSurplusClick}
                variant="link"
                style={checkSelected('Surplus Only') && { color: '#1a5a96' }}
              >
                Surplus Active
              </LinkButton>{' '}
              |{' '}
              <LinkButton
                style={checkSelected('All') && { color: '#1a5a96' }}
                onClick={handleShowAllClick}
                variant="link"
              >
                All
              </LinkButton>
            </p>
          </div>
        </>
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
