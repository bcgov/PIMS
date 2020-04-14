import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { FormikProps } from 'formik';
import { Form, Input } from 'components/common/form';
import { IEvaluation } from 'actions/parcelsActions';

interface EvaluationProps {
  nameSpace?: string;
  evaluation?: any;
  index?: number;
  disabled?: boolean;
}
export const defaultEvaluationValues: IEvaluation = {
  date: '',
  key: '',
  value: '',
};
const EvaluationForm = <T extends any>(props: EvaluationProps & FormikProps<T>) => {
  const withNameSpace: Function = (name?: string) => {
    return [props.nameSpace, `${props.index}`, name].filter(x => x).join('.');
  };
  return (
    <Fragment>
      <Form.Row className="evaluationForm">
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Fiscal Year
            </Form.Label>
            <Input
              disabled={props.disabled}
              type="number"
              className="col-md-10"
              field={withNameSpace('date')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Assessed Value
            </Form.Label>
            <Input
              disabled={props.disabled}
              type="number"
              className="col-md-10"
              field={withNameSpace('value')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Estimated Value
            </Form.Label>
            <Input
              disabled={props.disabled}
              type="number"
              className="col-md-10"
              field={withNameSpace('estimatedValue')}
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={2}>
              Appraised Value
            </Form.Label>
            <Input
              disabled={props.disabled}
              type="number"
              className="col-md-10"
              field={withNameSpace('appraisedValue')}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={2}>
              Net Book Value
            </Form.Label>
            <Input
              disabled={props.disabled}
              type="number"
              className="col-md-10"
              field={withNameSpace('netBookValue')}
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default EvaluationForm;
