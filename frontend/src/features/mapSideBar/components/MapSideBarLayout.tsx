import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import TooltipWrapper from 'components/common/TooltipWrapper';
import VisibilitySensor from 'react-visibility-sensor';
import { InventoryPolicy } from './InventoryPolicy';
import { SidebarSize, SidebarContextType } from '../hooks/useQueryParamSideBar';
import { FaWindowClose } from 'react-icons/fa';
import './MapSideBarLayout.scss';
import variables from '_variables.module.scss';
import AbbreviatedText from 'components/common/AbbreviatedText';

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

const CloseIcon = styled(FaWindowClose)`
  color: ${variables.textColor};
  font-size: 30px;
  cursor: pointer;
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
                <CloseIcon
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
