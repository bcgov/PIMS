import './BuildingPopupView.scss';

import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from '../../constants/evaluationKeys';

export interface IBuildingDetailProps {
  building: IBuilding | null;
}

export const BuildingPopupView: React.FC<IBuildingDetailProps> = ({ building }) => {
  return (
    <Container className="buildingPopup" fluid={true}>
      {!building ? (
        <Alert variant="danger">Failed to load building details.</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              <ListGroup.Item>
                <Label>Assessed Value: </Label>$
                {building?.evaluations
                  ?.find(e => e.key === EvaluationKeys.Assessed)
                  ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <div>
                  <Label>Address: </Label>
                  {building?.address?.line1}
                </div>
                <div>
                  {building?.address?.city}, {building?.address?.province}{' '}
                  {building?.address?.postal}
                </div>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Label>Floor Count: </Label>
                {building?.buildingFloorCount}
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>Predominate Use: </Label>
                {building?.buildingPredominateUse}
              </ListGroup.Item>
              {building?.projectNumber && (
                <ListGroup.Item>
                  <Label>RAEG or SPP: </Label>
                  {building?.projectNumber}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};
