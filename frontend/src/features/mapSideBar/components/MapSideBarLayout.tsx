import './MapSideBarLayout.scss';

import variables from '_variables.module.scss';
import classNames from 'classnames';
import AbbreviatedText from 'components/common/AbbreviatedText';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as React from 'react';
import { FaWindowClose } from 'react-icons/fa';
import VisibilitySensor from 'react-visibility-sensor';
import styled from 'styled-components';

import { SidebarContextType, SidebarSize } from '../hooks/useQueryParamSideBar';
import { InventoryPolicy } from './InventoryPolicy';

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
  /** property name for title */
  propertyName?: string;
}

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  height: 4rem;
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
  propertyName,
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
                <FaWindowClose
                  style={{ color: variables.textColor, fontSize: '30px', cursor: 'pointer' }}
                  title="close"
                  onClick={() => setShowSideBar(false, undefined, undefined, true)}
                />
              </TooltipWrapper>
            </HeaderRow>
            {propertyName && (
              <AbbreviatedText text={propertyName} maxLength={50} className="propertyName" />
            )}
            {isVisible ? props.children : null}
          </>
        )}
      </VisibilitySensor>
    </div>
  );
};

export default MapSideBarLayout;
