import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { SresManual } from 'features/projects/common';
import { ReactComponent as CloseSquare } from 'assets/images/close-square.svg';
import TooltipWrapper from 'components/common/TooltipWrapper';
import VisibilitySensor from 'react-visibility-sensor';

interface IMapSideBarLayoutProps {
  show: boolean;
  setShowSideBar: (show: boolean) => void;
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

/**
 * SideBar layout with control bar and then form content passed as child props.
 * @param param0
 */
const MapSideBarLayout: React.FunctionComponent<IMapSideBarLayoutProps> = ({
  show,
  setShowSideBar,
  ...props
}) => {
  return (
    <div className={classNames('map-side-drawer', show ? 'show' : null)}>
      <VisibilitySensor partialVisibility={true}>
        {({ isVisible }: any) => (
          <>
            <HeaderRow>
              <h2 className="mr-auto">Property Details</h2>
              <SresManual hideText={true} />
              <small className="p-1 mr-2">Inventory Policy</small>
              <TooltipWrapper toolTipId="close-sidebar-tooltip" toolTip="Close Form">
                <CloseSquare title="close" onClick={() => setShowSideBar(false)} />
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
