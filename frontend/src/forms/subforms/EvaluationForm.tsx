import { Fragment, useState } from 'react';
import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { FormikProps, setIn, getIn } from 'formik';
import { Form, InputGroup, FastDatePicker } from 'components/common/form';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import _ from 'lodash';
import WrappedPaginate from 'components/common/WrappedPaginate';
import { IPaginate } from 'utils/CommonFunctions';
import { formikFieldMemo, decimalOrEmpty } from 'utils';

interface EvaluationProps {
  /** the formik tracked namespace of this component */
  nameSpace: string;
  /** whether this form is enabled for editing */
  disabled?: boolean;
}

/**
 * Extend IEvaluation, add the year of the evaluation (regardless of whether the date is set.)
 */
interface IFinancial extends IFiscal, IEvaluation {
  /** the year placeholder of this evaluation */
  year?: number;
  rowVersion?: string;
  parcelId?: number;
}
const NUMBER_OF_EVALUATIONS_PER_PAGE = 2;
const NUMBER_OF_GENERATED_EVALUATIONS = 20;
const currentYear = moment().year();
const yearsArray = _.range(currentYear, currentYear - NUMBER_OF_GENERATED_EVALUATIONS, -1);
const keyTypes = { ...EvaluationKeys, ...FiscalKeys };
//configures the react paginate control on this page.
const pagedFinancials: IPaginate = {
  page: 0,
  total: yearsArray.length,
  quantity: NUMBER_OF_EVALUATIONS_PER_PAGE,
  items: yearsArray,
  maxPages: 3,
};

const findMatchingFinancial = (financials: IFinancial[], type: string, year?: number) => {
  return financials.find(
    financial =>
      (financial.year === year ||
        moment(financial.date).year() === year ||
        financial.year === year ||
        financial.fiscalYear === year) &&
      financial.key === type,
  );
};
const indexOfFinancial = (financials: IFinancial[], type: string, year?: number) =>
  _.indexOf(financials, findMatchingFinancial(financials, type, year));
/**
 * get a list of defaultEvaluations, generating one for NUMBER_OF_GENERATED_EVALUATIONS
 */
export const defaultFinancials: IFinancial[] = _.flatten(
  yearsArray.map(year => {
    return Object.values(keyTypes).map(type => {
      return {
        date: type === EvaluationKeys.Assessed ? moment(year, 'YYYY').toDate() : '',
        year: year,
        fiscalYear: year,
        key: type,
        value: '',
      };
    });
  }),
);
/**
 * Merge the passed list of evaluations with this components defaultEvaluations.
 * @param existingFinancials
 */
export const getMergedFinancials = (existingFinancials: IFinancial[]) => {
  const placeholderFinancials = _.cloneDeep(defaultFinancials);
  existingFinancials.forEach((evaluation: IFinancial) => {
    const index = indexOfFinancial(
      placeholderFinancials,
      evaluation.key,
      evaluation.fiscalYear ?? moment(evaluation.date).year(),
    );
    evaluation.year = evaluation.fiscalYear ?? moment(evaluation.date).year();
    placeholderFinancials[index] = evaluation;
  });
  return placeholderFinancials;
};

export const validateFinancials = (financials: IFinancial[], nameSpace: string) => {
  // Yup has major performance issues with the validation of large arrays.
  // As a result, handle the validation manually here.
  let errors = {};
  financials.forEach((evaluation, index) => {
    if (evaluation.date && evaluation.key === EvaluationKeys.Appraised && !evaluation.value) {
      errors = setIn(errors, `${nameSpace}.${index}.value`, 'Required');
    } else if (
      evaluation.value &&
      evaluation.key === EvaluationKeys.Appraised &&
      !evaluation.date
    ) {
      errors = setIn(errors, `${nameSpace}.${index}.date`, 'Required');
    }
  });
  return errors;
};

export const filterEmptyFinancials = (evaluations: IFinancial[]) =>
  _.filter(evaluations, evaluation => {
    evaluation.value = decimalOrEmpty(evaluation.value);
    return !!evaluation.value || (evaluation.key === EvaluationKeys.Appraised && !!evaluation.date);
  });

/**
 * Subform Component intended to be embedded in a higher level formik component.
 */
const EvaluationForm = <T extends any>(props: EvaluationProps & FormikProps<T>) => {
  const financials: IFinancial[] = getIn(props.values, props.nameSpace);
  // the current paginated page.
  const [currentPage, setCurrentPage] = useState<number[]>(
    _.slice(pagedFinancials.items, 0, NUMBER_OF_EVALUATIONS_PER_PAGE),
  );
  const withNameSpace = (name: string, type: string, year?: number): string => {
    return [props.nameSpace, `${indexOfFinancial(financials, type, year)}`, name]
      .filter(x => x)
      .join('.');
  };
  const isFiscal = (type: string) => {
    return Object.keys(FiscalKeys).includes(type);
  };

  return (
    <Fragment>
      <Form.Row className="evaluationForm">
        <Row noGutters>
          {Object.values(keyTypes).map(type => {
            return (
              <Col md={3} key={type}>
                <h6>{type}</h6>
                <Table bordered>
                  <thead>
                    <tr>
                      <td>
                        {EvaluationKeys.Appraised === type && 'Date'}
                        {EvaluationKeys.Assessed === type && 'Year'}
                        {(FiscalKeys.Estimated === type || FiscalKeys.NetBook === type) &&
                          'Fiscal Year'}
                      </td>
                      <td>Value</td>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPage?.map(year => {
                      return (
                        <tr key={type + year}>
                          <td>
                            {type === EvaluationKeys.Assessed && (
                              <Form.Control
                                disabled={true}
                                readOnly={true}
                                type="string"
                                value={year.toString()}
                              />
                            )}
                            {isFiscal(type) && (
                              <Form.Control
                                disabled={true}
                                readOnly={true}
                                type="string"
                                value={`${year - 1}/${year}`}
                              />
                            )}
                            {type === EvaluationKeys.Appraised && (
                              <FastDatePicker
                                formikProps={props}
                                disabled={props.disabled}
                                minDate={moment(year, 'YYYY')
                                  .startOf('year')
                                  .toDate()}
                                maxDate={moment(year, 'YYYY')
                                  .endOf('year')
                                  .toDate()}
                                field={withNameSpace('date', type, year)}
                              />
                            )}
                          </td>
                          <td>
                            <InputGroup
                              formikProps={props}
                              disabled={props.disabled}
                              fast={true}
                              type="number"
                              preText="$"
                              field={withNameSpace('value', type, year)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            );
          })}
        </Row>
      </Form.Row>
      <WrappedPaginate
        onPageChange={(page: any) => {
          setCurrentPage(
            _.slice(
              pagedFinancials.items,
              page.selected * NUMBER_OF_EVALUATIONS_PER_PAGE,
              page.selected * NUMBER_OF_EVALUATIONS_PER_PAGE + NUMBER_OF_EVALUATIONS_PER_PAGE,
            ),
          );
        }}
        {...pagedFinancials}
      />
    </Fragment>
  );
};

export default React.memo(EvaluationForm, (prevProps, currentProps) => {
  const prev = { formikProps: prevProps, field: prevProps.nameSpace };
  const curr = { formikProps: currentProps, field: currentProps.nameSpace };
  return formikFieldMemo(prev, curr);
});
