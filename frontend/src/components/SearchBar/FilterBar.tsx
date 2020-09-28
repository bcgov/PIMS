import './FilterBar.scss';

import React, { PropsWithChildren } from 'react';
import { Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form, Button, ButtonProps } from 'components/common/form';
import { FaSearch } from 'react-icons/fa';
import ResetButton from 'components/common/form/ResetButton';

const SearchButton: React.FC<ButtonProps> = ({ ...props }) => {
  return <Button type="submit" className="bg-warning" {...props} icon={<FaSearch size={20} />} />;
};

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
