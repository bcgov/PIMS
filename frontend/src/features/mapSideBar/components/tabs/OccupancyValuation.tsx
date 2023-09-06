import {
  FastCurrencyInput,
  FastDatePicker,
  FastInput,
  Input,
  InputGroup,
} from 'components/common/form';
import { BuildingSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { getIn, useFormikContext } from 'formik';
import moment from 'moment';
import React, { Dispatch, SetStateAction } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { formatFiscalYear } from 'utils';

interface IOccupancyValuation {
  withNameSpace: Function;
  disabled?: boolean;
  classifications: any;
  editInfo: {
    identification: boolean;
    tenancy: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
}

/**
 * @description For buildings, shows info on occupancy and valuation
 * @param {IOccupancyValuation} props
 * @returns React component.
 */
export const OccupancyValuation: React.FC<any> = (props: IOccupancyValuation) => {
  const { setEditInfo, editInfo, withNameSpace, disabled } = props;
  const formikProps = useFormikContext();
  const currentYear = moment().year();

  const evaluationIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('evaluations')),
    EvaluationKeys.Assessed,
    currentYear,
  );
  const fiscalIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('fiscals')),
    FiscalKeys.NetBook,
    currentYear,
  );
  const netBookYear = getIn(formikProps.values, withNameSpace(`fiscals.${fiscalIndex}.fiscalYear`));

  return (
    <Col md={6} style={{ paddingLeft: '10px' }}>
      <Row>
        <div className="tenancy">
          <Row className="section-header">
            <Col md="auto">
              <span>
                <BuildingSvg className="svg" />
                <h5>Occupancy</h5>
              </span>
            </Col>
            {!disabled && (
              <Col md="auto">
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({
                      ...editInfo,
                      tenancy: formikProps.isValid && !editInfo.tenancy,
                    })
                  }
                />
              </Col>
            )}
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Total Area</Label>
            </Col>
            <Col md="auto">
              <InputGroup
                displayErrorTooltips
                fast={true}
                formikProps={formikProps}
                disabled={editInfo.tenancy}
                type="number"
                field={withNameSpace('totalArea')}
                postText="Sq. M"
                style={{ border: 0 }}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Net Usable Area</Label>
            </Col>
            <Col md="auto">
              <InputGroup
                displayErrorTooltips
                fast={true}
                formikProps={formikProps}
                disabled={editInfo.tenancy}
                type="number"
                field={withNameSpace('rentableArea')}
                postText="Sq. M"
                style={{ border: 0 }}
                required
              />
            </Col>
          </Row>
          <Row className="content-item">
            <Col md="auto">
              <Label>Tenancy %</Label>
            </Col>
            <Col md="auto">
              <span className="tenancy-fields">
                <FastInput
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  field={withNameSpace('buildingTenancy')}
                />
                <FastDatePicker
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  field={withNameSpace('buildingTenancyUpdatedOn')}
                />
              </span>
            </Col>
          </Row>
        </div>
      </Row>
      <Row>
        <div className="valuation">
          <Row className="section-header">
            <Col md="auto">
              <span>
                <BuildingSvg className="svg" />
                <h5>Valuation</h5>
              </span>
            </Col>
            {!disabled && (
              <Col md="auto">
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({
                      ...editInfo,
                      valuation: formikProps.isValid && !editInfo.valuation,
                    })
                  }
                />
              </Col>
            )}
          </Row>
          <Row className="val-item" style={{ display: 'flex' }}>
            <Col md="auto">
              <Label>Net Book Value</Label>
            </Col>
            <Col md="auto">
              <FastCurrencyInput
                formikProps={formikProps}
                field={`data.fiscals.${fiscalIndex}.value`}
                disabled={editInfo.valuation}
              />
            </Col>
            <Col md="auto">
              <Input
                field="netbookYearDisplay"
                value={formatFiscalYear(netBookYear)}
                disabled
                style={{ width: 50, fontSize: 11 }}
              />
            </Col>
          </Row>
          <Row className="val-item" style={{ display: 'flex' }}>
            <Col md="auto" style={{ paddingLeft: '2px' }}>
              <Label>Assessed Value</Label>
            </Col>
            <Col md="auto">
              <FastCurrencyInput
                formikProps={formikProps}
                field={`data.evaluations.${evaluationIndex}.value`}
                disabled={editInfo.valuation}
              />
            </Col>
            <Col md="auto">
              <Input
                field={`data.evaluations.${evaluationIndex}.year`}
                disabled
                style={{ width: 50, fontSize: 11 }}
              />
            </Col>
          </Row>
        </div>
      </Row>
    </Col>
  );
};
