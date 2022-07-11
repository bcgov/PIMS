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
import { LookupType, useLookups } from 'store/hooks';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectInformationProps {
  disabled?: boolean;
}

export const ProjectInformation: React.FC<IProjectInformationProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();
  const { controller } = useLookups();

  const agencies = controller.getOptionsWithParents(LookupType.Agency);

  return (
    <styled.ProjectInformation className="project-details">
      <Row>
        <Col>
          <Input label="Project No." field="projectNumber" disabled={true} />
          <Input label="Name" field="name" required disabled={disabled} />
          <ParentSelect
            label="Project Agency"
            field="agencyId"
            options={agencies}
            filterBy={['code', 'label', 'parent']}
            convertValue={Number}
            required
            disabled={disabled}
          />
        </Col>
        <TextArea label="Description" field="description" disabled={disabled} />
      </Row>
      <Row>
        <Col>
          <FastDatePicker
            label="Project Approved On"
            field="approvedOn"
            formikProps={formik}
            required
            disabled={disabled}
          />
          <FastFiscalYearInput
            label="Reported Fiscal Year"
            field="reportedFiscalYear"
            formikProps={formik}
            required
            disabled={disabled}
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
