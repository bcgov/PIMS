import './BuildingPopupView.scss';

import * as React from 'react';
import { ListGroup, Container } from 'react-bootstrap';
import { IBuilding } from 'actions/parcelsActions';
import { Alert, Row, Col } from 'react-bootstrap';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from '../../constants/evaluationKeys';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Link } from 'react-router-dom';
import Claims from 'constants/claims';

export interface IBuildingDetailProps {
  building: IBuilding | null;
  disabled?: boolean;
}

export const BuildingPopupView: React.FC<IBuildingDetailProps> = (props: IBuildingDetailProps) => {
  const keycloak = useKeycloakWrapper();
  const buildingDetail: IBuilding | null | undefined = props?.building;

  return (
    <Container className="buildingPopup" fluid={true}>
      {!buildingDetail ? (
        <Alert variant="danger">Failed to load building details.</Alert>
      ) : (
        <Row>
          <Col>
            <ListGroup>
              <ListGroup.Item>
                <Label>Name: </Label>
                {buildingDetail?.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>Description: </Label>
                {buildingDetail?.description}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Label>Assessed Value: </Label>$
                {buildingDetail?.evaluations
                  ?.find(e => e.key === EvaluationKeys.Assessed)
                  ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <div>
                  <Label>Address: </Label>
                  {buildingDetail?.address?.line1}
                </div>
                <div>
                  {buildingDetail?.address?.administrativeArea}, {buildingDetail?.address?.province}{' '}
                  {buildingDetail?.address?.postal}
                </div>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup>
              <ListGroup.Item>
                <Label>Floor Count: </Label>
                {buildingDetail?.buildingFloorCount}
              </ListGroup.Item>
              <ListGroup.Item>
                <Label>Predominate Use: </Label>
                {buildingDetail?.buildingPredominateUse}
              </ListGroup.Item>
              {buildingDetail?.projectNumber && (
                <ListGroup.Item>
                  <Label>RAEG or SPP: </Label>
                  {buildingDetail?.projectNumber}
                </ListGroup.Item>
              )}
            </ListGroup>
            {!props?.disabled &&
              (!keycloak.hasAgency(buildingDetail?.agencyId as number) &&
              !keycloak.hasClaim(Claims.ADMIN_PROPERTIES) ? (
                <Link to={`/submitProperty/${buildingDetail?.parcelId}?disabled=true`}>View</Link>
              ) : (
                <Link to={`/submitProperty/${buildingDetail?.parcelId}`}>Update</Link>
              ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};
