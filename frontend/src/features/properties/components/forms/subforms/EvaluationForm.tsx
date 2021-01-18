import { Fragment, useMemo } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { IEvaluation, IFiscal } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import _ from 'lodash';
import { isPositiveNumberOrZero } from 'utils';
import { Table } from 'components/Table';
import { getNetbookCols, getAssessedCols } from './columns';

interface EvaluationProps {
  /** the formik tracked namespace of this component */
  nameSpace: string;
  /** whether this form is enabled for editing */
  disabled?: boolean;
  /** whether to show the appraisal value on the form or not*/
  showAppraisal?: boolean;
  /** whether the form is being used on parcel or building */
  isParcel?: boolean;
  /** if the improvements should be displayed */
  showImprovements?: boolean;
}

/**
 * Extend IEvaluation, add the year of the evaluation (regardless of whether the date is set.)
 */
export interface IFinancial extends IFiscal, IEvaluation {
  /** the year placeholder of this evaluation */
  year?: number;
  rowVersion?: string;
  parcelId?: number;
  createdOn?: string;
  updatedOn?: string;
}

export interface IFinancialYear {
  assessed: IFinancial;
  appraised: IFinancial;
  netbook: IFinancial;
  market: IFinancial;
  improvements: IFinancial;
}
const NUMBER_OF_GENERATED_EVALUATIONS = 10;
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
        createdOn: '',
        updatedOn: '',
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
    evaluation.createdOn = undefined;
    evaluation.updatedOn = undefined;
    if (evaluation.date === '') {
      evaluation.date = undefined;
    }
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
 * Subform Component intended to be embedded in a higher level formik component.
 */
const EvaluationForm = <T extends any>(props: EvaluationProps & FormikProps<T>) => {
  const assessedCols: any = useMemo(
    () =>
      getAssessedCols(
        props.isParcel ? 'Land' : 'Assessed Building Value',
        props.disabled,
        props.nameSpace,
        props.showImprovements,
      ),
    [props.disabled, props.isParcel, props.nameSpace, props.showImprovements],
  );
  const netbookCols: any = useMemo(() => getNetbookCols(props.disabled, props.nameSpace), [
    props.disabled,
    props.nameSpace,
  ]);

  return (
    <Fragment>
      <div>
        <Table
          lockPageSize
          pageSize={-1}
          name="evaluations"
          columns={assessedCols}
          data={defaultFinancials}
          manualPagination={false}
          className="assessed"
        />
        <Table
          lockPageSize
          pageSize={-1}
          name="fiscals"
          columns={netbookCols}
          data={defaultFinancials}
          manualPagination={false}
          className="netbook"
        />
      </div>
    </Fragment>
  );
};

export default EvaluationForm;
