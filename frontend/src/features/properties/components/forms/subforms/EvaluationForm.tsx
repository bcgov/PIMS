import { Fragment, useMemo, useRef } from 'react';
import React from 'react';
import { FormikProps, getIn } from 'formik';
import { Form } from 'components/common/form';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import _ from 'lodash';
import { formikFieldMemo, isPositiveNumberOrZero } from 'utils';
import PaginatedFormErrors from './PaginatedFormErrors';
import { Table } from 'components/Table';
import { getEvaluationCols } from './EvaluationCols';

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

export interface IFinancialYear {
  assessed: IFinancial;
  appraised: IFinancial;
  netbook: IFinancial;
  estimated: IFinancial;
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

const findMatchingFinancial = (financials: IFinancial[], type: string, year?: number) => {
  return financials?.find((financialsForYear: any) => {
    const financial = financialsForYear[type.toLocaleLowerCase()];
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
export const defaultFinancials: any = yearsArray.map(year => {
  return _.reduce(
    Object.values(keyTypes) as string[],
    (acc, type) => ({
      ...acc,
      [type.toLocaleLowerCase()]: {
        date: type === EvaluationKeys.Assessed ? moment(year, 'YYYY').format('YYYY-MM-DD') : '',
        year: year,
        fiscalYear: year,
        key: type,
        value: '',
      },
    }),
    {} as IFinancialYear[],
  );
});
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
    if (index >= 0) {
      evaluation.year = (evaluation.fiscalYear as number) ?? moment(evaluation.date).year();
      placeholderFinancials[index][evaluation.key.toLocaleLowerCase()] = evaluation;
    }
  });
  return placeholderFinancials;
};

export const filterEmptyFinancials = (evaluations: IFinancial[]) =>
  _.filter(evaluations, evaluation => {
    return (
      isPositiveNumberOrZero(evaluation.value) ||
      (evaluation.key === EvaluationKeys.Appraised && !!evaluation.date)
    );
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
  const financials: IFinancialYear[] = getIn(props.values, props.nameSpace);
  const pagingRef: any = useRef();
  const cols: any = useMemo(
    () => getEvaluationCols(props.disabled, props.nameSpace, props.nameSpace === 'financials'),
    [props.disabled, props.nameSpace],
  );

  return (
    <Fragment>
      <PaginatedFormErrors
        errors={getPageErrors(props.errors, props.nameSpace)}
        pagingRef={pagingRef}
      />
      <div ref={pagingRef}>
        <Form.Row className="evaluationForm">
          <Table
            lockPageSize
            pageSize={NUMBER_OF_EVALUATIONS_PER_PAGE}
            pageCount={financials.length / NUMBER_OF_EVALUATIONS_PER_PAGE}
            name="evaluations"
            columns={cols}
            data={defaultFinancials}
            manualPagination={false}
          />
        </Form.Row>
      </div>
    </Fragment>
  );
};

export default React.memo(EvaluationForm, (prevProps, currentProps) => {
  const prev = { formikProps: prevProps, field: prevProps.nameSpace };
  const curr = { formikProps: currentProps, field: currentProps.nameSpace };
  return formikFieldMemo(prev, curr);
});
