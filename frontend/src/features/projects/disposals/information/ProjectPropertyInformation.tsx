import { FastCurrencyInput, Select } from 'components/common/form';
import { riskTooltips, tierTooltips } from 'features/projects/common';
import { useFormikContext } from 'formik';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { LookupType, useLookups } from 'store/hooks';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

export interface IProjectPropertyInformationProps {
  disabled?: boolean;
}

export const ProjectPropertyInformation: React.FC<IProjectPropertyInformationProps> = ({
  disabled = false,
}) => {
  const formik = useFormikContext<IProjectForm>();
  const { controller } = useLookups();

  const tiers = controller.getOptions(LookupType.TierLevel);
  const risks = controller.getOptions(LookupType.ProjectRisk);
  const { values } = formik;

  /**
   * Return a friendly tooltip for the specified tier level.
   * @param riskId The primary key 'id' of the tier level.
   * @returns A tooltip string.
   */
  const getTierLevelTooltip = (riskId: number | string) => {
    switch (parseInt(`${riskId}`)) {
      case 1:
        return tierTooltips.tier1Tooltip;
      case 2:
        return tierTooltips.tier2Tooltip;
      case 3:
        return tierTooltips.tier3Tooltip;
      case 4:
        return tierTooltips.tier4Tooltip;
      default:
        return null;
    }
  };

  /**
   * Return a friendly tooltip for the specified project risk.
   * @param riskId The primary key 'id' of the project risk.
   * @returns A tooltip string.
   */
  const getRiskTooltip = (riskId: number | string) => {
    switch (parseInt(`${riskId}`)) {
      case 1:
        return riskTooltips.risk1Tooltip;
      case 2:
        return riskTooltips.risk2Tooltip;
      case 3:
        return riskTooltips.risk3Tooltip;
      default:
        return null;
    }
  };

  return (
    <Col className="project-info">
      <div>
        <h2>Property Information</h2>
        <Row className="tierLevelId">
          <Select
            label="Assign Tier"
            placeholder="Must Select One"
            field="tierLevelId"
            type="number"
            options={tiers}
            required
            disabled={disabled}
          />
          <styled.Tooltip>
            <small>{getTierLevelTooltip(values.tierLevelId)}</small>
          </styled.Tooltip>
        </Row>
        <Row className="riskId">
          <Select
            label="Risk"
            placeholder="Must Select One"
            field="riskId"
            type="number"
            options={risks}
            required
            disabled={disabled}
          />
          <styled.Tooltip>
            <small>{getRiskTooltip(values.riskId)}</small>
          </styled.Tooltip>
        </Row>
      </div>
      <div>
        <h2>Financial Information</h2>
        <p>
          These values are for the <em>project</em>, not the individual properties.
        </p>
        <Row>
          <Col md="auto">
            <FastCurrencyInput
              label="Assessed Value"
              field="assessed"
              customInputWidth="200px"
              required
              formikProps={formik}
              disabled={disabled}
            />
            <FastCurrencyInput
              label="Net Book Value"
              field="netBook"
              required
              formikProps={formik}
              disabled={disabled}
            />
          </Col>
          <Col md="auto">
            <FastCurrencyInput
              label="Estimated Market Value"
              field="market"
              required
              formikProps={formik}
              disabled={disabled}
            />
            <FastCurrencyInput
              label="Appraised Value"
              field="appraised"
              formikProps={formik}
              disabled={disabled}
            />
          </Col>
          <Col md="auto">
            <FastCurrencyInput
              label="Estimated Sales Costs"
              field="salesCost"
              formikProps={formik}
              disabled={disabled}
            />
            <FastCurrencyInput
              label="Estimated Program Recovery Fees"
              field="programCost"
              formikProps={formik}
              disabled={disabled}
            />
          </Col>
        </Row>
      </div>
    </Col>
  );
};
