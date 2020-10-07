import { Fragment, memo } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import _ from 'lodash';
import { Form, FastCurrencyInput, DisplayCurrency } from 'components/common/form';
import { FiscalKeys } from 'constants/fiscalKeys';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { IFinancial, IFinancialYear } from './EvaluationForm';

/**
 * Sum the list of passed financial years.
 * create an object where all sums are keyed by evaluation/fiscal type.
 * @param financials an unordered list of financial years to sum.
 */
export const sumFinancialYears = (financials: IFinancialYear[], year?: number) => {
  const seperatedFinancials = _.flatten(
    financials.map((financial: IFinancialYear) => _.values(financial)),
  ) as IFinancial[];

  return sumFinancials(seperatedFinancials, year);
};

/**
 * Sum the list of passed financials.
 * create an object where all sums are keyed by evaluation/fiscal type.
 * @param financials an unordered list of financials to sum.
 */
export const sumFinancials = (financials: IFinancial[], year?: number) => {
  const summedFinancials: any = {};
  Object.keys({ ...EvaluationKeys, ...FiscalKeys }).forEach(type => {
    const typedFinancials = year
      ? _.filter(financials, financial => financial.key === type && financial.year === year)
      : _.filter(financials, financial => financial.key === type);
    const recentFinancialsForType = getMostRecentFinancials(typedFinancials);
    summedFinancials[type] = _.reduce(
      recentFinancialsForType,
      (sum, f) => sum + (f.value as number),
      0,
    );
  });
  return summedFinancials;
};

/**
 * From the passed list of financials,
 * get all financial values of the most recent year with one or more values.
 * @param financials an unordered list of financial values
 */
const getMostRecentFinancials = (financials: IFinancial[]) => {
  const orderedFinancials = _.orderBy(financials, 'year', 'desc');
  return _.reduce(
    orderedFinancials,
    (valuedFinancials: IFinancial[], orderedFinancial): IFinancial[] => {
      if (
        orderedFinancial.value &&
        (!valuedFinancials.length || valuedFinancials[0].year === orderedFinancial.year)
      ) {
        valuedFinancials.push(orderedFinancial);
      }
      return valuedFinancials;
    },
    [],
  );
};

type SumProps = {
  showAppraisal?: boolean;
  onlyAssesedSums?: boolean;
  year?: number;
  formikProps: FormikProps<any>;
};

/**
 * Component that displays the most recent summed financials from each type (netbook, estimate, ...)
 * @param param0 formik props for sum/memo calculations
 */
const SumFinancialsForm: React.FC<SumProps> = (props: SumProps) => {
  const allFinancials = [
    ...(props.formikProps.values?.financials ?? []),
    ..._.flatten(_.map(props.formikProps.values?.buildings ?? [], 'financials')),
  ];

  const buildings = [..._.flatten(_.map(props.formikProps.values?.buildings ?? [], 'financials'))];

  const withAppraised = () => {
    if (props.showAppraisal) {
      return (
        <Form.Row>
          <Form.Label column md={2}>
            Appraised Sum
          </Form.Label>
          <FastCurrencyInput
            formikProps={props.formikProps}
            disabled={true}
            outerClassName="col-md-10"
            value={summedFinancials[EvaluationKeys.Appraised]}
            field={EvaluationKeys.Appraised}
          />
        </Form.Row>
      );
    } else {
      return null;
    }
  };
  const summedFinancials: any = props.onlyAssesedSums
    ? sumFinancialYears(allFinancials, props.year)
    : sumFinancialYears(allFinancials) ?? {};
  const summedBuildingFinacnials: any = sumFinancialYears(buildings, props.year);
  if (props.onlyAssesedSums) {
    return (
      <>
        <td>
          <DisplayCurrency value={summedBuildingFinacnials.Assessed} />
        </td>
        <td>
          <DisplayCurrency value={summedFinancials.Assessed} />
        </td>
      </>
    );
  } else {
    return (
      <Fragment>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Assessed Sum
            </Form.Label>
            <FastCurrencyInput
              formikProps={props.formikProps}
              disabled={true}
              outerClassName="col-md-10"
              value={summedFinancials[EvaluationKeys.Assessed]}
              field={EvaluationKeys.Assessed}
            />
          </Form.Row>
          {withAppraised()}
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Net Book Sum
            </Form.Label>
            <FastCurrencyInput
              formikProps={props.formikProps}
              disabled={true}
              outerClassName="col-md-10"
              value={summedFinancials[FiscalKeys.NetBook]}
              field={FiscalKeys.NetBook}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Estimated Sum
            </Form.Label>
            <FastCurrencyInput
              formikProps={props.formikProps}
              disabled={true}
              outerClassName="col-md-10"
              value={summedFinancials[FiscalKeys.Estimated]}
              field={FiscalKeys.Estimated}
            />
          </Form.Row>
        </Col>
      </Fragment>
    );
  }
};

/**
 * Recalculate the summed values when financials are changed.
 */
export default memo(
  SumFinancialsForm,
  (prevProps, props) =>
    !props.formikProps.values ||
    (prevProps?.formikProps.values?.financials === props?.formikProps.values?.financials &&
      _.map(prevProps?.formikProps.values?.buildings, 'financials') ===
        _.map(props?.formikProps.values?.buildings, 'financials')),
);
