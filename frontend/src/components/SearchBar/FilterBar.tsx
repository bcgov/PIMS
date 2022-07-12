import './FilterBar.scss';

import { Form } from 'components/common/form';
import PlusButton from 'components/common/form/PlusButton';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import TooltipIcon from 'components/common/TooltipIcon';
import { Formik } from 'formik';
import React, { PropsWithChildren } from 'react';
import { Col } from 'react-bootstrap';
import { CSSProperties } from 'styled-components';

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
  /** the id for the tooltip of the plus button */
  toolTipAddId?: string;
  /** the text for the tooltip of the plus button */
  toolTipAddText?: string;
  /** override formiks handleReset default for customized components */
  customReset?: () => void;
  /** custom component field name to clear/reset */
  customResetField?: string;
  /** prop for adding tooltip to filter bar header (with icon) */
  headerTooltip?: boolean;
  /** prop used to control icon size of header tooltip */
  headerTooltipSize?: number;
  /** prop used to control css for header tooltip icon */
  headerTooltipStyle?: CSSProperties;
  /** prop used to control where the header tooltip is placed in relation to the icon */
  headerTooltipPlacement?: 'top' | 'bottom' | 'right' | 'left';
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
            {props.headerTooltip && (
              <TooltipIcon
                toolTipId="filter-header-tip"
                toolTip="Click the corresponding row to edit the administrative area"
                style={props.headerTooltipStyle}
                iconSize={props.headerTooltipSize}
                placement={props.headerTooltipPlacement}
              />
            )}
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
