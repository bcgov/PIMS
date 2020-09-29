import './FilterBar.scss';

import React, { PropsWithChildren } from 'react';
import { Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';

interface IProps<T extends object = {}> {
  initialValues: T;
  onChange: (value: any) => void;
}

const FilterBar = <T extends object = {}>(props: PropsWithChildren<IProps<T>>) => {
  return (
    <Formik<T>
      initialValues={props.initialValues}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        props.onChange?.({ ...values });
        setSubmitting(false);
      }}
      onReset={(values, { setSubmitting }) => {
        setSubmitting(true);
        props.onChange?.({ ...values });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, handleReset }) => (
        <Form>
          <Form.Row className="search-bar">
            {props.children}
            <Col className="bar-item flex-grow-0">
              <SearchButton disabled={isSubmitting} />
            </Col>
            <Col className="bar-item flex-grow-0">
              <ResetButton disabled={isSubmitting} onClick={handleReset} />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default FilterBar;
