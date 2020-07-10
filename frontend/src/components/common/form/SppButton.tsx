import './SppButton.scss';

import React, { useState, useRef } from 'react';
import { ReactComponent as SppIcon } from 'assets/images/SPP.svg';
import { Col, Overlay, Tooltip, Button, Row, Image } from 'react-bootstrap';

interface ISppButtonProps {
  handleErpClick: () => void;
  handleSppClick: () => void;
}

const SppButton: React.FC<ISppButtonProps> = ({ handleErpClick, handleSppClick }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <div className="sppButton">
      <Button ref={target} className="close" onClick={() => setShow(true)}>
        <SppIcon title="spp" />
      </Button>
      <Overlay target={target.current!} show={show} placement="bottom">
        {(props: any) => (
          <Tooltip id="overlay-example" {...props} className="sppTooltip">
            <h6>Properties On Surplus Properties Program</h6>
            <Row onClick={handleErpClick}>
              <Col xs={2} className="marker">
                <Image src={require('assets/images/marker-icon-2x-red.png')} />
              </Col>
              <Col className="label">Enhanced Referral Process</Col>
            </Row>
            <Row onClick={handleSppClick}>
              <Col xs={2} className="marker">
                <Image src={require('assets/images/marker-icon-2x-violet.png')} />
              </Col>
              <Col className="label">Surplus Properties List</Col>
            </Row>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
};

export default SppButton;
