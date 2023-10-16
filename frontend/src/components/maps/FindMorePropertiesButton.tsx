import variables from '_variables.module.scss';
import FindMorePropertiesForm from 'components/SearchBar/FindMorePropertiesForm';
import React, { useMemo } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { BsXSquareFill } from 'react-icons/bs';
import { FaSign } from 'react-icons/fa';
import styled from 'styled-components';

/** popover that is triggered on button click to display form contents */
const StyledPopover = styled(Popover)`
  max-width: 100%;
`;

/** close button displayed in top right of popover title */
const CloseButton = styled(BsXSquareFill)`
  margin-left: 256px;
  cursor: pointer;
`;

/** icon for sign used within component, styled blue */
const TitleForSaleSign = styled(FaSign)`
  fill: ${variables.primaryColor};
  margin-right: 5px;
`;

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
      <div >
        <TitleForSaleSign  />
        <h3>{buttonText}</h3>
        <CloseButton onClick={() => document.body.click()} />
      </div>
    );
    return (
      <StyledPopover id="popover-basic">
        <Popover.Header>
          {' '}
          <TitleContent />{' '}
        </Popover.Header>
        <Popover.Body>
          <FindMorePropertiesForm />
        </Popover.Body>
      </StyledPopover>
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
      <Button className='button-col'>
          <FaSign size={20} />
          <p>Surplus Properties</p>
      </Button>
    </OverlayTrigger>
  );
};
