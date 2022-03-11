import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import React from 'react';
import { IProjectForm } from '../interfaces';
import { FastCurrencyInput, Select } from 'components/common/form';
import { useLookups, LookupType } from 'store/hooks';

export interface IProjectPropertyInformationProps {}

export const ProjectPropertyInformation: React.FC<IProjectPropertyInformationProps> = () => {
  const formik = useFormikContext<IProjectForm>();
  const { controller } = useLookups();

  const tiers = controller.getOptions(LookupType.TierLevel);
  const risks = controller.getOptions(LookupType.ProjectRisk);

  return (
    <Col className="project-info">
      <div>
        <h2>Property Information</h2>
        <Row>
          <Select
            label="Assign Tier"
            placeholder="Must Select One"
            field="tierLevelId"
            type="number"
            options={tiers}
            required
          />
          <Select
            label="Risk"
            placeholder="Must Select One"
            field="riskId"
            type="number"
            options={risks}
            required
          />
          <div>&nbsp;</div>
        </Row>
      </div>
      <div>
        <h2>Financial Information</h2>
        <p>
          These values are for the <em>project</em>, not the individual properties.
        </p>
        <Row>
          <Col>
            <FastCurrencyInput
              label="Assessed Value"
              field="assessed"
              required
              formikProps={formik}
            />
            <FastCurrencyInput
              label="Net Book Value"
              field="netBook"
              required
              formikProps={formik}
            />
          </Col>
          <Col>
            <FastCurrencyInput
              label="Estimated Market Value"
              field="market"
              required
              formikProps={formik}
            />
            <FastCurrencyInput label="Appraised Value" field="appraised" formikProps={formik} />
          </Col>
          <Col>
            <FastCurrencyInput
              label="Estimated Sales Costs"
              field="salesCost"
              formikProps={formik}
            />
            <FastCurrencyInput
              label="Estimated Program Recovery Fees"
              field="programCost"
              formikProps={formik}
            />
          </Col>
        </Row>
      </div>
    </Col>
  );
};
