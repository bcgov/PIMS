import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import ClickAwayListener from 'react-click-away-listener';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';

const SearchMarkerButton = styled.button`
  top: 20px;
  right: 20px;
  border: 0px;
  background-color: none;
  display: flex;
`;

interface IMovePinFormProps {
  /** used for determining nameSpace of field */
  nameSpace?: string;
  /** help set the cursor type when click the add marker button */
  setMovingPinNameSpace: (nameSpace?: string) => void;
}

// Component that allows a user to move an existing parcel map marker.
const MovePinForm = ({ setMovingPinNameSpace, nameSpace }: IMovePinFormProps) => (
  <Row noGutters className="section">
    <Col md={12}>
      <h5>Update Parcel Location</h5>
    </Col>
    <Col md={12} className="instruction">
      <p style={{ textAlign: 'center' }}>
        Click on the pin, and then click on the new location on the map for this parcel.
      </p>
      <Row>
        <Col className="marker-svg">
          <ClickAwayListener
            onClickAway={() => {
              setMovingPinNameSpace(undefined);
            }}
          >
            <SearchMarkerButton
              type="button"
              onClick={(e: any) => {
                setMovingPinNameSpace(nameSpace ?? '');
                e.preventDefault();
              }}
            >
              <ParcelDraftIcon className="parcel-icon" />
            </SearchMarkerButton>
          </ClickAwayListener>
        </Col>
      </Row>
    </Col>
  </Row>
);

export default MovePinForm;
