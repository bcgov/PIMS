import { AgencyResponses, FormikTable, IProject } from '../../common';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { mapLookupCodeWithParentString } from 'utils';
import { Button, Col, Row } from 'react-bootstrap';
import { AgencyInterestColumns } from './AgencyInterestColumns';
import useCodeLookups from 'hooks/useLookupCodes';

export interface IAgencyInterestProps {
  /** Whether the controls are disabled. */
  disabled?: boolean;
}

/**
 * Returns a component to display a table containing agency interest responses.
 * @param param0 Property attributes.
 */
export const AgencyInterest = ({ disabled = false }: IAgencyInterestProps) => {
  const { values, setValues, setFieldValue } = useFormikContext<IProject>();
  const [enableAdd, setEnableAdd] = React.useState(false);
  const lookupCodes = useCodeLookups();

  const agencies = lookupCodes.getByType(API.AGENCY_CODE_SET_NAME);
  const agencyOptions = (agencies ?? []).map(c => mapLookupCodeWithParentString(c, agencies));

  const onAddAgency = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const selectedAgency = getIn(values, 'addAgencyResponse');
    const agency = agencies.find(a => ((a.id as unknown) as number) === parseInt(selectedAgency));
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
   * @param vals An array of selected values.
   */
  const onAgencySelected = (vals: any) => {
    if (!!vals?.length) {
      const found = values.projectAgencyResponses.find(r => r.agencyId === parseInt(vals[0].value));
      setEnableAdd(found === undefined);
    } else {
      setEnableAdd(false);
    }
  };

  return (
    <>
      <h3>Agency Interest</h3>
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

interface IAddAgencyProps {
  /** The project to add the agency response to. */
  project: IProject;
  /** The agency who responded. */
  agency: ILookupCode;
  /** The agency response note. */
  note: string;
  /** Whether the agency is interested or not. */
  response: AgencyResponses;
}

/**
 * Add the specified agency response to the project.
 * @param param0 The options.
 */
const addAgency = ({ project, agency, note, response }: IAddAgencyProps) => {
  const responses = [...project.projectAgencyResponses];
  responses.push({
    agencyId: parseInt(agency.id, 10),
    agencyCode: agency.name,
    projectId: project.id as number,
    response: response,
    note: note,
  });
  return { ...project, projectAgencyResponses: responses };
};
