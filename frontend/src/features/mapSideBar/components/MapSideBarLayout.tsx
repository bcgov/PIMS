import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import TooltipWrapper from 'components/common/TooltipWrapper';
import VisibilitySensor from 'react-visibility-sensor';
import { InventoryPolicy } from './InventoryPolicy';
import { SidebarSize, SidebarContextType } from '../hooks/useQueryParamSideBar';
import { FaWindowClose } from 'react-icons/fa';
import './MapSideBarLayout.scss';

interface IMapSideBarLayoutProps {
  show: boolean;
  setShowSideBar: (
    show: boolean,
    contextName?: SidebarContextType,
    size?: SidebarSize,
    resetIds?: boolean,
  ) => void;
  title: React.ReactNode;
  hidePolicy?: boolean;
  size?: SidebarSize;
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  height: 4rem;
  svg:hover {
    cursor: pointer;
    filter: opacity(0.8);
  }
`;

const CloseIcon = styled(FaWindowClose)`
  color: #494949;
  font-size: 30px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: 700;
  width: 100%;
  text-align: left;
`;

/**
 * SideBar layout with control bar and then form content passed as child props.
 * @param param0
 */
const MapSideBarLayout: React.FunctionComponent<IMapSideBarLayoutProps> = ({
  show,
  setShowSideBar,
  hidePolicy,
  title,
  size,
  ...props
}) => {
  return (
    <div
      className={classNames('map-side-drawer', show ? 'show' : null, {
        close: !show,
        narrow: size === 'narrow',
      })}
    >
      <VisibilitySensor partialVisibility={true}>
        {({ isVisible }: any) => (
          <>
            <HeaderRow>
              <Title className="mr-auto">{title}</Title>
              {!hidePolicy && <InventoryPolicy />}
              <TooltipWrapper toolTipId="close-sidebar-tooltip" toolTip="Close Form">
                <CloseIcon
                  title="close"
                  onClick={() => setShowSideBar(false, undefined, undefined, true)}
                />
              </TooltipWrapper>
            </HeaderRow>

            {isVisible ? props.children : null}
          </>
        )}
      </VisibilitySensor>
    </div>
  );
};

export default MapSideBarLayout;
