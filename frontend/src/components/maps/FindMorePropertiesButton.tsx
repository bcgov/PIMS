import React, { useMemo } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { BsXSquareFill } from 'react-icons/bs';
import { FaSign } from 'react-icons/fa';
import styled from 'styled-components';
import FindMorePropertiesForm from 'components/SearchBar/FindMorePropertiesForm';

const ButtonContent = styled.div`
  display: flex;
  .p {
    font-size: 16px;
  }
`;

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
  fill: #003366;
  margin-right: 5px;
`;

interface IFindMorePropertiesButton {
  /** the text to appear beside the sign icon on the FindMorePropertiesButton */
  buttonText: string;
}

/** this component contains the trigger for additional filter options off the base filter */
export const FindMorePropertiesButton: React.FC<IFindMorePropertiesButton> = ({ buttonText }) => {
  const TitleContent = () =>
    useMemo(
      () => (
        <div style={{ display: 'flex' }}>
          <TitleForSaleSign size={42} />
          <h3 style={{ color: '#003366' }}>{buttonText}</h3>
          <CloseButton onClick={() => document.body.click()} />
        </div>
      ),
      [],
    );

  /** this provides a way to create a form with tooltip like behaviour in the overlay trigger */
  const popover = useMemo(
    () => (
      <StyledPopover id="popover-basic">
        <Popover.Title>
          {' '}
          <TitleContent />{' '}
        </Popover.Title>
        <Popover.Content>
          <FindMorePropertiesForm />
        </Popover.Content>
      </StyledPopover>
    ),
    [],
  );

  return (
    <OverlayTrigger trigger="click" rootClose transition overlay={popover} placement="bottom">
      <Button style={{ height: 38 }}>
        <ButtonContent>
          <FaSign size={20} style={{ marginRight: 5, marginTop: 3 }} />
          <p>Find available properties</p>
        </ButtonContent>
      </Button>
    </OverlayTrigger>
  );
};
