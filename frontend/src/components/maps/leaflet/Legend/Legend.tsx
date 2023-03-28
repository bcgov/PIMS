import './Legend.scss';

import buildingRegPng from 'assets/images/pins/building-reg.png';
import landRegPng from 'assets/images/pins/land-reg.png';
import markerPurplePng from 'assets/images/pins/marker-purple.png';
import markerRedPng from 'assets/images/pins/marker-red.png';
import subdivRegPng from 'assets/images/pins/subdiv-reg.png';
import * as React from 'react';
import { Card, Col, Image, Row } from 'react-bootstrap';

export const Legend = () => {
  const keys = React.useMemo(() => {
    return [
      {
        pin: landRegPng,
        label: 'Parcel',
      },
      {
        pin: buildingRegPng,
        label: 'Building',
      },
      {
        pin: subdivRegPng,
        label: 'Proposed Subdivision',
      },
      {
        pin: markerRedPng,
        label: 'Enhanced Referral Process',
      },
      {
        pin: markerPurplePng,
        label: 'Surplus Properties List',
      },
    ];
  }, []);

  return (
    <Card className="legend-control">
      <Card.Header>Marker Legend</Card.Header>

      <Card.Body>
        {keys.map((item, index) => {
          return (
            <Row key={index}>
              <Col xs={2}>
                <Image height={25} src={item.pin} />
              </Col>
              <Col className="label">{item.label}</Col>
            </Row>
          );
        })}
      </Card.Body>
    </Card>
  );
};
