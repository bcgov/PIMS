import * as React from 'react';
import styled from 'styled-components';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Label } from 'components/common/Label';

const InnerRow = styled(Row)`
  margin: 0px;
  width: 300px;
`;

const LeftCol = styled(Col)`
  width: 110px;
  max-width: 135px;
  padding-right: 10px;
  padding-left: 0px;
`;

const CenterCol = styled(Col)`
  max-width: 1px;
  padding: 0px;
  background-color: rgba(96, 96, 96, 0.2);
`;

const RightCol = styled(Col)`
  padding-left: 10px;
  padding-right: 0px;
`;

interface IThreeColItem {
  leftSideLabel: string;
  rightSideItem: string | number | React.ReactNode | undefined;
}

export const ThreeColumnItem: React.FC<IThreeColItem> = ({ leftSideLabel, rightSideItem }) => {
  return (
    <InnerRow>
      <LeftCol>
        <ListGroup.Item className="left-side">
          <Label>{leftSideLabel}</Label>
        </ListGroup.Item>
      </LeftCol>
      <CenterCol />
      <RightCol>
        <ListGroup.Item>{rightSideItem}</ListGroup.Item>
      </RightCol>
    </InnerRow>
  );
};
