import { Fragment, useState } from 'react';
import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { FormikProps, setIn, getIn } from 'formik';
import { Form, FastDatePicker, FastCurrencyInput } from 'components/common/form';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import _ from 'lodash';
import WrappedPaginate from 'components/common/WrappedPaginate';
import { IPaginate } from 'utils/CommonFunctions';
import { formikFieldMemo, getCurrentFiscalYear, isPositiveNumberOrZero } from 'utils';
import PaginatedFormErrors from './PaginatedFormErrors';
import SumFinancialsForm from './SumFinancialsForm';

interface EvaluationProps {
  /** the formik tracked namespace of this component */
  nameSpace: string;
  /** whether this form is enabled for editing */
  disabled?: boolean;
  /** whether to show the appraisal value on the form or not*/
  showAppraisal?: boolean;
  /** whether the form is being used on parcel or building */
  isParcel?: boolean;
}

/**
 * Extend IEvaluation, add the year of the evaluation (regardless of whether the date is set.)
 */
export interface IFinancial extends IFiscal, IEvaluation {
  /** the year placeholder of this evaluation */
  year?: number;
  rowVersion?: string;
  parcelId?: number;
}
const NUMBER_OF_EVALUATIONS_PER_PAGE = 2;
const NUMBER_OF_GENERATED_EVALUATIONS = 20;
const currentYear = moment().year();
const adjustedFiscalYear = moment().month() >= 3 ? currentYear + 1 : currentYear;
const yearsArray = _.range(
  adjustedFiscalYear,
  adjustedFiscalYear - NUMBER_OF_GENERATED_EVALUATIONS,
  -1,
);
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
  return financials?.find(financial => {
    return (
      ((financial.date !== undefined && moment(financial.date).year() === year) ||
        financial.fiscalYear === year) &&
      financial.key === type
    );
  });
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
        date: type === EvaluationKeys.Assessed ? moment(year, 'YYYY').format('YYYY-MM-DD') : '',
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
      (evaluation.fiscalYear as number) ?? moment(evaluation.date).year(),
    );
    evaluation.year = (evaluation.fiscalYear as number) ?? moment(evaluation.date).year();
    placeholderFinancials[index] = evaluation;
  });
  return placeholderFinancials;
};

export const validateFinancials = (
  financials: IFinancial[],
  nameSpace: string,
  showAppraisal?: boolean,
) => {
  // Yup has major performance issues with the validation of large arrays.
  // As a result, handle the validation manually here.
  let errors = {};
  filterFutureAssessedValues(financials).forEach((financial, index) => {
    //All financials are required for the current year except appraised.
    if (
      financial.fiscalYear === getCurrentFiscalYear() &&
      !isPositiveNumberOrZero(financial.value) &&
      financial.key !== EvaluationKeys.Appraised &&
      financial.key !== FiscalKeys.Estimated &&
      !(
        financial.key === EvaluationKeys.Assessed &&
        financial?.year &&
        financial.year > moment().year()
      )
    ) {
      errors = setIn(errors, `${nameSpace}.${index}.value`, 'Required');
    }

    //if one of date/value for the Appraised field is filled in the other field is required as well.
    if (
      showAppraisal &&
      financial.date &&
      financial.key === EvaluationKeys.Appraised &&
      !isPositiveNumberOrZero(financial.value)
    ) {
      errors = setIn(errors, `${nameSpace}.${index}.value`, 'Required');
    } else if (
      showAppraisal &&
      !isPositiveNumberOrZero(financial.value) &&
      financial.key === EvaluationKeys.Appraised &&
      !financial.date
    ) {
      errors = setIn(errors, `${nameSpace}.${index}.date`, 'Required');
    }
  });
  return errors;
};

export const filterEmptyFinancials = (evaluations: IFinancial[]) =>
  _.filter(evaluations, evaluation => {
    return !!evaluation.value || (evaluation.key === EvaluationKeys.Appraised && !!evaluation.date);
  });

export const filterFutureAssessedValues = (evaluations: IFinancial[]) =>
  _.filter(evaluations, evaluation => {
    return (
      evaluation.key !== EvaluationKeys.Assessed ||
      (evaluation.key === EvaluationKeys.Assessed && evaluation.year! <= moment().year())
    );
  });
/**
 * Get the paginated page numbers that contain errors.
 */
const getPageErrors = (errors: any, nameSpace: any) => {
  const evaluationErrors = getIn(errors, nameSpace);
  const errorsPerPage = Object.keys(keyTypes).length * NUMBER_OF_EVALUATIONS_PER_PAGE;
  return _.uniq(
    _.reduce(
      evaluationErrors,
      (acc: number[], error, index) => {
        if (error) {
          acc.push(Math.ceil((parseInt(index) + 1) / errorsPerPage));
        }
        return acc;
      },
      [],
    ),
  );
};

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
  console.log(props);
  return (
    <Fragment>
      <PaginatedFormErrors
        nameSpace="Evaluations"
        errors={getPageErrors(props.errors, props.nameSpace)}
      />
      <Form.Row className="evaluationForm">
        <Row noGutters>
          {Object.values(keyTypes).map(type => {
            if (!props.showAppraisal && type === EvaluationKeys.Appraised) {
              return null;
            } else {
              return (
                <Col xs={EvaluationKeys.Assessed === type && props.isParcel ? 5 : 3} key={type}>
                  <h6>{type}</h6>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>
                          {EvaluationKeys.Appraised === type && 'Date'}
                          {EvaluationKeys.Assessed === type && 'Year'}
                          {(FiscalKeys.Estimated === type || FiscalKeys.NetBook === type) &&
                            'Fiscal Year'}
                        </th>
                        <th>
                          {EvaluationKeys.Assessed === type && props.isParcel ? 'Land' : 'Value'}
                        </th>
                        {EvaluationKeys.Assessed === type && props.isParcel && (
                          <>
                            <th>Improvements</th>
                            <th>Total</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {currentPage
                        ?.filter(
                          year =>
                            type !== EvaluationKeys.Assessed ||
                            (type === EvaluationKeys.Assessed && year <= moment().year()),
                        )
                        .map(year => {
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
                                <FastCurrencyInput
                                  formikProps={props}
                                  disabled={props.disabled}
                                  field={withNameSpace('value', type, year)}
                                  placeholder={props.disabled ? 'n/a' : ' '}
                                  tooltip="If value not available enter $1 and add notes"
                                />
                              </td>
                              {EvaluationKeys.Assessed === type && props.isParcel && (
                                <>
                                  <SumFinancialsForm
                                    formikProps={props}
                                    onlyAssesedSums={true}
                                    year={year}
                                  />
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Col>
              );
            }
          })}
        </Row>
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
      </Form.Row>
    </Fragment>
  );
};

export default React.memo(EvaluationForm, (prevProps, currentProps) => {
  const prev = { formikProps: prevProps, field: prevProps.nameSpace };
  const curr = { formikProps: currentProps, field: currentProps.nameSpace };
  return formikFieldMemo(prev, curr);
});
