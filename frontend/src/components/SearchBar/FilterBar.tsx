import './FilterBar.scss';

import React, { PropsWithChildren } from 'react';
import { Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import PlusButton from 'components/common/form/PlusButton';

interface IProps<T extends object = {}> {
  initialValues: T;
  onChange: (value: any) => void;
  /** controls the className of the search button */
  searchClassName?: string;
  /** determine whether to hide the reset button */
  hideReset?: boolean;
  /** determine whether the plus button is needed for this filter bar */
  plusButton?: boolean;
  /** make a heading for this fitler bar */
  filterBarHeading?: string;
  /** if the filter bar is enabled to add a new entity control what happens on click */
  handleAdd?: (value: any) => void;
  /** the two probs below are for controlling the tool tip for the plust button */
  toolTipAddId?: string;
  toolTipAddText?: string;
  /** override formiks handleReset default for customized components */
  customReset?: () => void;
  /** custom component field name to clear/reset */
  customResetField?: string;
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
      {({ isSubmitting, handleReset, setFieldValue }) => (
        <Form>
          <Form.Row className="search-bar">
            <h3 className="filterBarHeading">{props.filterBarHeading}</h3>
            {props.children}
            <Col className="bar-item flex-grow-0">
              <SearchButton
                className={props.searchClassName ? props.searchClassName : 'bg-warning'}
                disabled={isSubmitting}
              />
            </Col>
            {!props.hideReset && (
              <Col className="bar-item flex-grow-0">
                <ResetButton
                  disabled={isSubmitting}
                  onClick={() => {
                    if (props.customReset && props.customResetField) {
                      props.customReset();
                      setFieldValue(props.customResetField, '');
                    } else {
                      handleReset();
                    }
                  }}
                />
              </Col>
            )}
            {props.plusButton && (
              <>
                <div className="vl"></div>
                <Col className="bar-item flex-grow-0 plus-button">
                  <PlusButton
                    onClick={props.handleAdd}
                    toolId={props.toolTipAddId!}
                    toolText={props.toolTipAddText!}
                  />
                </Col>
              </>
            )}
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default FilterBar;
