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
        <>
          <Row>
            <Col>
              <ListGroup>
                <ListGroup.Item className="name">{buildingDetail?.name}</ListGroup.Item>
                {buildingDetail?.name !== buildingDetail?.description ? (
                  <ListGroup.Item>{buildingDetail?.description}</ListGroup.Item>
                ) : null}
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Assessed Value:</Label>$
                  {buildingDetail?.evaluations
                    ?.find(e => e.key === EvaluationKeys.Assessed)
                    ?.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </ListGroup.Item>
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <div>{buildingDetail?.address?.line1}</div>
                  <div>
                    {buildingDetail?.address?.administrativeArea},{' '}
                    {buildingDetail?.address?.province} {buildingDetail?.address?.postal}
                  </div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup>
                <ListGroup.Item>
                  <Label>Agency:</Label>
                  {buildingDetail?.agency}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Label>Floor Count:</Label>
                  {buildingDetail?.buildingFloorCount}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Label>Predominate Use:</Label>
                  {buildingDetail?.buildingPredominateUse}
                </ListGroup.Item>
                {buildingDetail?.projectNumber && (
                  <ListGroup.Item>
                    <Label>SPP:</Label>
                    {buildingDetail?.projectNumber}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>

          {buildingDetail?.parcelId && !props?.disabled && (
            <Row className="menu">
              <Col>
                <Link to={`/submitProperty/${buildingDetail?.parcelId}?disabled=true`}>View</Link>
                {(keycloak.hasAgency(buildingDetail?.agencyId as number) ||
                  keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) && (
                  <Link
                    style={{ paddingLeft: '5px' }}
                    to={`/submitProperty/${buildingDetail?.parcelId}`}
                  >
                    Update
                  </Link>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};
