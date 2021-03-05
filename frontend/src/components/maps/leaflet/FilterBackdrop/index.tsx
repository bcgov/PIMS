import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';

export interface FilterBackdropProps {
  show?: boolean;
}

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
`;

const FilterBackdrop: React.FC<FilterBackdropProps> = ({ show }) => {
  return show ? (
    <Backdrop>
      <Spinner animation="border" variant="warning" />
    </Backdrop>
  ) : null;
};

export default FilterBackdrop;
