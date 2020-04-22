import { Fragment, useState } from 'react';
import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { FormikProps, setIn, getIn } from 'formik';
import { Form } from 'components/common/form';
import { IEvaluation } from 'actions/parcelsActions';
import { EvaluationKeys } from 'constants/evaluationKeys';
import moment from 'moment';
import _ from 'lodash';
import { FormikDatePicker } from 'components/common/FormikDatePicker';
import WrappedPaginate from 'components/common/WrappedPaginate';
import { IPaginate } from 'utils/CommonFunctions';
import { FormikInputGroup } from 'components/common/form/InputGroup';

interface EvaluationProps {
  /** the formik tracked namespace of this component */
  nameSpace: string;
  /** whether this form is enabled for editing */
  disabled?: boolean;
}

/**
 * Extend IEvaluation, add the year of the evaluation (regardless of whether the date is set.)
 */
interface IFormEvaluation extends IEvaluation {
  /** the year placeholder of this evaluation */
  year?: number;
}
const NUMBER_OF_EVALUATIONS_PER_PAGE = 2;
const NUMBER_OF_GENERATED_EVALUATIONS = 20;
const currentYear = moment().year();
const yearsArray = _.range(currentYear, currentYear - NUMBER_OF_GENERATED_EVALUATIONS, -1);
const keyTypes = { ...EvaluationKeys /** ...FiscalKeys*/ };
const findMatchingEvaluation = (evaluations: IFormEvaluation[], type: string, year?: number) => {
  return evaluations.find(
    evaluation =>
      (evaluation.year === year || moment(evaluation.date).year() === year) &&
      evaluation.key === type,
  );
};
const indexOfEvaluation = (evaluations: IFormEvaluation[], type: string, year?: number) =>
  _.indexOf(evaluations, findMatchingEvaluation(evaluations, type, year));
//configures the react paginate control on this page.
const pagedEvaluations: IPaginate = {
  page: 0,
  total: yearsArray.length,
  quantity: NUMBER_OF_EVALUATIONS_PER_PAGE,
  items: yearsArray,
  maxPages: 3,
};
/**
 * get a list of defaultEvaluations, generating one for NUMBER_OF_GENERATED_EVALUATIONS
 */
export const defaultEvaluations: IFormEvaluation[] = _.flatten(
  yearsArray.map(year => {
    return Object.values(keyTypes).map(type => {
      return {
        date: type === EvaluationKeys.Assessed ? moment(year, 'YYYY').toDate() : '',
        year: year,
        key: type,
        value: '',
      };
    });
  }),
);
/**
 * Merge the passed list of evaluations with this components defaultEvaluations.
 * @param existingEvaluations
 */
export const getMergedEvaluations = (existingEvaluations: IFormEvaluation[]) => {
  const placeholderEvaluations = _.cloneDeep(defaultEvaluations);
  existingEvaluations.forEach((evaluation: IFormEvaluation) => {
    const index = indexOfEvaluation(
      placeholderEvaluations,
      evaluation.key,
      moment(evaluation.date).year(),
    );
    evaluation.year = moment(evaluation.date).year();
    placeholderEvaluations[index] = evaluation;
  });
  return placeholderEvaluations;
};

/**
 * Subform Component intended to be embedded in a higher level formik component.
 */
const EvaluationForm = <T extends any>(props: EvaluationProps & FormikProps<T>) => {
  let evaluations: IFormEvaluation[] = getIn(props.values, props.nameSpace!);
  // the current paginated page.
  const [currentPage, setCurrentPage] = useState<number[]>(
    _.slice(pagedEvaluations.items, 0, NUMBER_OF_EVALUATIONS_PER_PAGE),
  );
  const withNameSpace = (name: string, type: string, year?: number): string => {
    return [props.nameSpace, `${indexOfEvaluation(evaluations, type, year)}`, name]
      .filter(x => x)
      .join('.');
  };

  // Yup has major performance issues with the validation of large arrays.
  // As a result, handle the validation manually here.
  evaluations.forEach(evaluation => {
    if (evaluation.date && !evaluation.value && evaluation.key === EvaluationKeys.Appraised) {
      props.setErrors(
        setIn(props.errors, withNameSpace('value', evaluation.key, evaluation.year), 'Required'),
      );
    } else if (evaluation.value && !evaluation.date) {
      props.setErrors(
        setIn(props.errors, withNameSpace('date', evaluation.key, evaluation.year), 'Required'),
      );
    }
  });

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
                      <td>{EvaluationKeys.Assessed === type ? 'Year' : 'Date'}</td>
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
                            {type === EvaluationKeys.Appraised && (
                              <FormikDatePicker
                                disabled={props.disabled}
                                minDate={moment(year, 'YYYY')
                                  .startOf('year')
                                  .toDate()}
                                maxDate={moment(year, 'YYYY')
                                  .endOf('year')
                                  .toDate()}
                                name={withNameSpace('date', type, year)}
                              />
                            )}
                          </td>
                          <td>
                            <FormikInputGroup
                              disabled={props.disabled}
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
              pagedEvaluations.items,
              page.selected * NUMBER_OF_EVALUATIONS_PER_PAGE,
              page.selected * NUMBER_OF_EVALUATIONS_PER_PAGE + NUMBER_OF_EVALUATIONS_PER_PAGE,
            ),
          );
        }}
        {...pagedEvaluations}
      />
    </Fragment>
  );
};

export default React.memo(EvaluationForm, (currentProps, prevProps) => {
  if (currentProps.nameSpace) {
    const currentValue = getIn(currentProps.values, currentProps.nameSpace);
    const prevValue = getIn(prevProps.values, prevProps.nameSpace);
    return _.isEqual(currentValue, prevValue);
  }
  return false;
});
