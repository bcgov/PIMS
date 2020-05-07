import { Fragment, memo } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import _ from 'lodash';
import { Form, FastCurrencyInput } from 'components/common/form';
import { FiscalKeys } from 'constants/fiscalKeys';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { IFinancial } from './EvaluationForm';

/**
 * Sum the list of passed financials.
 * create an object where all sums are keyed by evaluation/fiscal type.
 * @param financials an unordered list of financials to sum.
 */
const sumFinancials = (financials: IFinancial[]) => {
  const summedFinancials: any = {};
  Object.keys({ ...EvaluationKeys, ...FiscalKeys }).forEach(type => {
    const typedFinancials = _.filter(financials, financial => financial.key === type);
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

/**
 * Component that displays the most recent summed financials from each type (netbook, estimate, ...)
 * @param param0 formik props for sum/memo calculations
 */
const SumFinancialsForm: React.FC<FormikProps<any>> = formikProps => {
  const allFinancials = [
    ...(formikProps.values?.financials ?? []),
    ..._.flatten(_.map(formikProps.values?.buildings ?? [], 'financials')),
  ];
  const summedFinancials: any = sumFinancials(allFinancials) ?? {};
  return (
    <Fragment>
      <Col md={6}>
        <Form.Row>
          <Form.Label column md={2}>
            Assessed Sum
          </Form.Label>
          <FastCurrencyInput
            formikProps={formikProps}
            disabled={true}
            outerClassName="col-md-10"
            value={summedFinancials[EvaluationKeys.Assessed]}
            field={EvaluationKeys.Assessed}
          />
        </Form.Row>
        <Form.Row>
          <Form.Label column md={2}>
            Appraised Sum
          </Form.Label>
          <FastCurrencyInput
            formikProps={formikProps}
            disabled={true}
            outerClassName="col-md-10"
            value={summedFinancials[EvaluationKeys.Appraised]}
            field={EvaluationKeys.Appraised}
          />
        </Form.Row>
      </Col>
      <Col md={6}>
        <Form.Row>
          <Form.Label column md={2}>
            NetBook Sum
          </Form.Label>
          <FastCurrencyInput
            formikProps={formikProps}
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
            formikProps={formikProps}
            disabled={true}
            outerClassName="col-md-10"
            value={summedFinancials[FiscalKeys.Estimated]}
            field={FiscalKeys.Estimated}
          />
        </Form.Row>
      </Col>
    </Fragment>
  );
};

/**
 * Recalculate the summed values when financials are changed.
 */
export default memo(
  SumFinancialsForm,
  (prevProps, props) =>
    !props.values ||
    (prevProps?.values?.financials === props?.values?.financials &&
      _.map(prevProps?.values?.buildings, 'financials') ===
        _.map(props?.values?.buildings, 'financials')),
);
