import './FindMorePropertiesButton.scss';

import FindMorePropertiesForm from 'components/SearchBar/FindMorePropertiesForm';
import React, { useMemo } from 'react';
import { Button, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { BsXSquareFill } from 'react-icons/bs';
import { FaSign } from 'react-icons/fa';

interface IFindMorePropertiesButton {
  /** the text to appear beside the sign icon on the FindMorePropertiesButton */
  buttonText: string;
  /** behaviour for when the popover is opened */
  onEnter?: () => void;
  /** behaviour for when the popover is closed */
  onExit?: () => void;
}

/** this component contains the trigger for additional filter options off the base filter */
export const FindMorePropertiesButton: React.FC<IFindMorePropertiesButton> = ({
  buttonText,
  onEnter,
  onExit,
}) => {
  /** this provides a way to create a form with tooltip like behaviour in the overlay trigger */
  const popover = useMemo(() => {
    const TitleContent = () => (
      <Row>
        <Col className="sale-sign">
          <FaSign />
        </Col>
        <Col className="title-text">
          <div>{buttonText}</div>
        </Col>
        <Col className="close-button">
          <BsXSquareFill onClick={() => document.body.click()} />
        </Col>
      </Row>
    );
    return (
      <Popover className="popover-style">
        <Popover.Header className="title-content">
          <Col>
            <TitleContent />
          </Col>
        </Popover.Header>
        <Popover.Body>
          <FindMorePropertiesForm />
        </Popover.Body>
      </Popover>
    );
  }, [buttonText]);

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      transition
      onExit={onExit}
      onEnter={onEnter}
      overlay={popover}
      placement="bottom"
    >
      <Button className="surplus-properties-button">
        <div className="button-content">
          <FaSign className="button-sign" />
          <span className="button-text">Surplus Properties</span>
        </div>
      </Button>
    </OverlayTrigger>
  );
};
