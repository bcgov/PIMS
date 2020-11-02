import * as React from 'react';
import MapSideBarLayout from '../components/MapSideBarLayout';
import useParamSideBar from '../hooks/useQueryParamSideBar';
import ParcelDetailContainer from 'features/mapSideBar/containers/ParcelDetailContainer';

interface IMapSideBarContainerProps {}

/**
 * container responsible for logic related to map sidebar display.
 */
const MapSideBarContainer: React.FunctionComponent<IMapSideBarContainerProps> = () => {
  const { showSideBar, setShowSideBar } = useParamSideBar();
  return (
    <MapSideBarLayout show={showSideBar} setShowSideBar={setShowSideBar}>
      <ParcelDetailContainer setShowSideBar={setShowSideBar} />
    </MapSideBarLayout>
  );
};

export default MapSideBarContainer;
