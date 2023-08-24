import './FilterBar.scss';

import { Form } from 'components/common/form';
import PlusButton from 'components/common/form/PlusButton';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import TooltipIcon from 'components/common/TooltipIcon';
import { Formik } from 'formik';
import React, { CSSProperties, PropsWithChildren } from 'react';
import { Col, Row } from 'react-bootstrap';

interface IProps<T extends object> {
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

const FilterBar = <T extends object>(props: PropsWithChildren<IProps<T>>) => {
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
          <Form.Group className="search-bar">
            <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
              {props.headerTooltip && (
                <Col md="auto">
                  <TooltipIcon
                    toolTipId="filter-header-tip"
                    toolTip="Click the corresponding row to edit the administrative area"
                    style={props.headerTooltipStyle}
                    iconSize={props.headerTooltipSize}
                    placement={props.headerTooltipPlacement}
                  />
                </Col>
              )}
              <Col md="auto">
                <h3 className="filterBarHeading">{props.filterBarHeading}</h3>
              </Col>
              {props.children}
              <Col className="filter-bar-icon" md="auto">
                <SearchButton
                  className={props.searchClassName ? props.searchClassName : 'bg-warning'}
                  disabled={isSubmitting}
                />
              </Col>
              {!props.hideReset && (
                <Col className="filter-bar-icon" md="auto">
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
                  <Col md="auto">
                    <div className="vl"></div>
                  </Col>
                  <Col className="filter-bar-icon" md="auto">
                    <PlusButton
                      onClick={props.handleAdd}
                      toolId={props.toolTipAddId!}
                      toolText={props.toolTipAddText!}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

export default FilterBar;
