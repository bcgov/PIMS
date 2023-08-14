import { FastCurrencyInput, FastInput, FastSelect } from 'components/common/form';
import { LandSvg } from 'components/common/Icons';
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

interface IUsageValuationProps {
  withNameSpace: Function;
  disabled?: boolean;
  classifications: any;
  editInfo: {
    identification: boolean;
    usage: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
}

export const UsageValuation: React.FC<any> = (props: IUsageValuationProps) => {
  const { setEditInfo, editInfo, withNameSpace, classifications, disabled } = props;
  const formikProps = useFormikContext();

  const currentYear = moment().year();

  const fiscalIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('fiscals')),
    FiscalKeys.NetBook,
    currentYear,
  );

  const evaluationIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('evaluations')),
    EvaluationKeys.Assessed,
    currentYear,
  );

  const netBookYear = getIn(formikProps.values, withNameSpace(`fiscals.${fiscalIndex}.fiscalYear`));

  return (
    <>
      <Row>
        <div className="usage">
          <Row className="section-header">
            <Col md="auto">
              <span>
                <LandSvg className="svg" />
                <h5>Usage</h5>
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
                      usage: formikProps.isValid && !editInfo.usage,
                    })
                  }
                />
              </Col>
            )}
          </Row>
          <Row className="classification field-row">
            <Col md="auto" style={{ marginLeft: '20px' }}>
              <Label>Classification</Label>
            </Col>
            <Col md="auto">
              <FastSelect
                formikProps={formikProps}
                disabled={editInfo.usage}
                type="number"
                placeholder="Must Select One"
                field={withNameSpace('classificationId')}
                options={classifications}
                required={true}
              />
            </Col>
          </Row>
          <Row className="field-row">
            <Col md="auto" style={{ marginLeft: '7px' }}>
              <Label>Current Zoning</Label>
            </Col>
            <Col md="auto">
              <FastInput
                formikProps={formikProps}
                disabled={editInfo.usage}
                field={withNameSpace('zoning')}
              />
            </Col>
          </Row>
          <Row className="field-row">
            <Col md="auto">
              <Label style={{ marginLeft: '-0.5px' }}>Potential Zoning</Label>
            </Col>
            <Col md="auto">
              <FastInput
                formikProps={formikProps}
                disabled={editInfo.usage}
                field={withNameSpace('zoningPotential')}
              />
            </Col>
          </Row>
        </div>
      </Row>
      <Row className="content-item">
        <div className="valuation">
          <Row className="section-header">
            <Col md="auto">
              <span>
                <LandSvg className="svg" />
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
          <Row className="val-row">
            <Col md="auto">
              <Label>Net Book Value</Label>
            </Col>
            <Col md="auto">
              <FastCurrencyInput
                formikProps={formikProps}
                field={withNameSpace(`fiscals.${fiscalIndex}.value`)}
                disabled={editInfo.valuation}
              />
            </Col>
            <Col md="auto">
              <FastInput
                formikProps={formikProps}
                field="netBookYearDisplay"
                value={formatFiscalYear(netBookYear)}
                disabled
                style={{ width: 50, fontSize: 11 }}
              />
            </Col>
          </Row>
          <Row className="val-row">
            <Col md="auto" style={{ marginLeft: '2px' }}>
              <Label>Assessed Value</Label>
            </Col>
            <Col md="auto">
              <FastCurrencyInput
                formikProps={formikProps}
                field={withNameSpace(`evaluations.${evaluationIndex}.value`)}
                disabled={editInfo.valuation}
              />
            </Col>
            <Col md="auto">
              <FastInput
                formikProps={formikProps}
                field={withNameSpace(`evaluations.${evaluationIndex}.year`)}
                disabled
                style={{ width: 50, fontSize: 11 }}
              />
            </Col>
          </Row>
        </div>
      </Row>
    </>
  );
};
