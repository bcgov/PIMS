import * as React from 'react';
import styled from 'styled-components';
import { InventoryPolicy } from '../components/InventoryPolicy';
import { BuildingSvg, LandSvg } from 'components/common/Icons';

const SidebarContent = styled.div`
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 16px;
`;

const InventoryPolicyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid #d9d9d9;
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
  border: 2px solid #1a5a96;
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
  color: #494949;
  height: 47px;
  width: 47px;
  margin-right: 16px;
`;

const RawLandIcon = styled(LandSvg)`
  color: #494949;
  height: 47px;
  width: 47px;
  margin-right: 16px;
`;

const ActionPrimaryText = styled.p`
  font-size: 21px;
  color: #1a5a96;
  margin-bottom: 0px;
`;
const ActionSecondaryText = styled.p`
  font-size: 12px;
  color: #494949;
  margin-bottom: 0px;
`;

interface ISubmitPropertySelectorProps {
  addBuilding: () => void;
  addRawLand: () => void;
}

const SubmitPropertySelector: React.FC<ISubmitPropertySelectorProps> = ({
  addBuilding,
  addRawLand,
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
        <Action onClick={addRawLand}>
          <RawLandIcon className="svg" />
          <ActionLabelWrapper>
            <ActionPrimaryText>Add Raw Land</ActionPrimaryText>
            <ActionSecondaryText>PID or PIN</ActionSecondaryText>
          </ActionLabelWrapper>
        </Action>
      </ActionsWrapper>
    </SidebarContent>
  );
};

export default SubmitPropertySelector;
