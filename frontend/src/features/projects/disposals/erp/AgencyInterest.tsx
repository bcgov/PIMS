import { ParentSelect } from 'components/common/form/ParentSelect';
import { FormikTable } from 'features/projects/common';
import { AgencyResponses } from 'features/projects/constants';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { LookupType, useLookups } from 'store/hooks';

import { IProjectForm } from '../interfaces';
import { AgencyInterestColumns } from './constants';
import { addAgency } from './utils';

export interface IAgencyInterestProps {
  /** Whether the controls are disabled. */
  disabled?: boolean;
}

/**
 * Returns a component to display a table containing agency interest responses.
 * @param param0 Property attributes.
 */
export const AgencyInterest = ({ disabled = false }: IAgencyInterestProps) => {
  const { values, setValues, setFieldValue } = useFormikContext<IProjectForm>();
  const [enableAdd, setEnableAdd] = React.useState(false);
  const { controller } = useLookups();

  const agencies = controller.getType(LookupType.Agency);
  const agencyOptions = controller.getOptionsWithParents(LookupType.Agency, true);

  const onAddAgency = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const selectedAgency = getIn(values, 'addAgencyResponse');
    const agency = agencies.find((a) => (a.id as unknown as number) === parseInt(selectedAgency));
    if (agency !== undefined) {
      const project = addAgency({
        project: values,
        agency: agency,
        note: '',
        response: AgencyResponses.Watch,
      });
      setValues(project, false);
      setEnableAdd(false);
      setFieldValue('addAgencyResponse', undefined);
    }
  };

  /**
   * When an agency is selected enable the 'add' button if that agency hasn't already responded.
   * @param rows An array of selected values.
   */
  const onAgencySelected = (rows: any) => {
    if (!!rows?.length) {
      const found = values.projectAgencyResponses.find(
        (r) => r.agencyId === parseInt(rows[0].value),
      );
      setEnableAdd(found === undefined);
    } else {
      setEnableAdd(false);
    }
  };

  return (
    <>
      <h2>Agency Interest</h2>
      {disabled ? null : (
        <Row>
          <Col md={5}>
            <ParentSelect
              field="addAgencyResponse"
              options={agencyOptions}
              filterBy={['code', 'label', 'parent']}
              placeholder="Enter an Agency"
              disabled={disabled}
              onChange={onAgencySelected}
            />
          </Col>
          <Col>
            <Button onClick={onAddAgency} disabled={!enableAdd}>
              Add
            </Button>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <FormikTable
            columns={AgencyInterestColumns({ disabled: disabled })}
            name="ProjectAgencyResponses"
            field="projectAgencyResponses"
          />
        </Col>
      </Row>
    </>
  );
};
