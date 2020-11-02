import * as React from 'react';
import ParcelDetailForm from 'features/properties/components/forms/ParcelDetailForm';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { LeafletMouseEvent } from 'leaflet';
import { RootState } from 'reducers/rootReducer';
import { FormikValues } from 'formik';

interface IParcelDetailContainerProps {
  setShowSideBar: (show: boolean) => void;
}
export enum ParcelDetailTabs {
  parcel = 'parcel',
  buildings = 'buildings',
}
/**
 * TODO: refactor parcel detail from to move additional logic to this container.
 * @param props
 */
const ParcelDetailContainer: React.FunctionComponent<IParcelDetailContainerProps> = props => {
  const [currentTab, setCurrentTab] = useState(ParcelDetailTabs.parcel);
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent.mapClickEvent,
  );
  const formikRef = React.useRef<FormikValues>();
  if (!!formikRef?.current && !!leafletMouseEvent) {
    formikRef.current.setFieldValue('latitude', leafletMouseEvent.latlng.lat);
    formikRef.current.setFieldValue('longitude', leafletMouseEvent.latlng.lng);
  }
  return (
    <ParcelDetailForm
      formikRef={formikRef}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      parcelDetail={null}
      secret="blah"
      setSidebarOpen={() => props.setShowSideBar(true)}
    />
  );
};

export default ParcelDetailContainer;
