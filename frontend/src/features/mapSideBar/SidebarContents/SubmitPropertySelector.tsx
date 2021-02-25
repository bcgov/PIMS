import * as React from 'react';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import { BuildingSvg, LandSvg, SubdivisionSvg } from 'components/common/Icons';
import variables from '_variables.module.scss';

const SidebarContent = styled.div`
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
  overflow-y: scroll;
`;

const InventoryPolicyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid ${variables.formBackground};
  margin-bottom: 16px;
`;

const ActionsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const Action = styled.div`
  width: 347px;
  height: 89px;
  border-radius: 8px;
  fill: #ffffff;
  border: 2px solid ${variables.slideOutBlue};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ActionLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 47px;
`;

const BuildingIcon = styled(BuildingSvg)`
  color: ${variables.textColor};
  height: 47px;
  width: 47px;
  margin-right: 16px;
`;

const BareLandIcon = styled(LandSvg)`
  color: ${variables.textColor};
  height: 47px;
  width: 47px;
  margin-right: 16px;
`;

const SubdivisionIcon = styled(SubdivisionSvg)`
  color: #494949;
  height: 47px;
  width: 47px;
  margin-right: 16px;
`;

const ActionPrimaryText = styled.p`
  font-size: 21px;
  color: ${variables.slideOutBlue};
  margin-bottom: 0px;
`;
const ActionSecondaryText = styled.p`
  font-size: 12px;
  color: ${variables.textColor};
  margin-bottom: 0px;
`;

interface ISubmitPropertySelectorProps {
  addBuilding: () => void;
  addBareLand: () => void;
  addSubdivision: () => void;
}

const SubmitPropertySelector: React.FC<ISubmitPropertySelectorProps> = ({
  addBuilding,
  addBareLand,
  addSubdivision,
}) => {
  return (
    <SidebarContent>
      <p>
        This will allow you to submit a property to the PIMS inventory. At any time during this
        process you can read the Inventory Policy by clicking on the icon that looks like this:
      </p>
      <InventoryPolicyWrapper>
        <InventoryPolicy />
      </InventoryPolicyWrapper>
      <p>To get started, choose the type of property to add to the PIMS inventory.</p>
      <ActionsWrapper>
        <Action onClick={addBuilding}>
          <BuildingIcon className="svg" />
          <ActionLabelWrapper>
            <ActionPrimaryText>Add a building</ActionPrimaryText>
          </ActionLabelWrapper>
        </Action>
        <Action onClick={addBareLand}>
          <BareLandIcon className="svg" />
          <ActionLabelWrapper>
            <ActionPrimaryText>Add Land</ActionPrimaryText>
            <ActionSecondaryText>PID or PIN</ActionSecondaryText>
          </ActionLabelWrapper>
        </Action>
        <Action onClick={addSubdivision}>
          <SubdivisionIcon className="svg" />
          <ActionLabelWrapper>
            <ActionPrimaryText>Add Potential Subdivision</ActionPrimaryText>
            <ActionSecondaryText>PID</ActionSecondaryText>
          </ActionLabelWrapper>
        </Action>
      </ActionsWrapper>
    </SidebarContent>
  );
};

export default SubmitPropertySelector;
