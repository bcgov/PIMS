import {
  FastDatePicker,
  FastFiscalYearInput,
  Input,
  ParentSelect,
  TextArea,
} from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import React from 'react';
import { useLookups, LookupType } from 'store/hooks';
import { IProjectForm } from '../interfaces';

import * as styled from './styled';

interface IProjectInformationProps {}

export const ProjectInformation: React.FC<IProjectInformationProps> = props => {
  const formik = useFormikContext<IProjectForm>();
  const { controller } = useLookups();

  const agencies = controller.getOptionsWithParents(LookupType.Agency);

  return (
    <styled.ProjectInformation className="project-details">
      <Row>
        <Col>
          <Input label="Project No." field="projectNumber" disabled={true} />
          <Input label="Name" field="name" required />
          <ParentSelect
            label="Project Agency"
            field="agencyId"
            options={agencies}
            filterBy={['code', 'label', 'parent']}
            convertValue={Number}
            required
          />
        </Col>
        <TextArea label="Description" field="description" />
      </Row>
      <Row>
        <Col>
          <FastDatePicker
            label="Project Approved On"
            field="approvedOn"
            formikProps={formik}
            required
          />
          <FastFiscalYearInput
            label="Reported Fiscal Year"
            field="reportedFiscalYear"
            formikProps={formik}
            required
          />
        </Col>
        <Col>
          <Input label="Manager Name" field="manager" />
          <FastFiscalYearInput
            label="Actual or Forecasted Fiscal Year of Sale"
            field="actualFiscalYear"
            formikProps={formik}
            required
          />
        </Col>
      </Row>
    </styled.ProjectInformation>
  );
};
