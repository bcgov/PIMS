import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { SidebarContextType } from './useQueryParamSideBar';
import { useDispatch } from 'react-redux';
import React from 'react';
import { IParcel, IBuilding } from 'actions/parcelsActions';
import { useApi } from 'hooks/useApi';
import { defaultBuildingValues } from '../SidebarContents/BuildingForm';
import { toast } from 'react-toastify';

interface IUseSideBarBuildingWithParcelLoader {
  /** whether or not the sidebar should be displayed */
  showSideBar: boolean;
  /** set the active context of the side bar */
  setSideBarContext: (context: SidebarContextType) => void;
  /** the parcelid that should be associated to this building. */
  associatedParcelId?: number;
  /** the edit state of the property in the side bar. */
  disabled?: boolean;
}

/** hook used to load associated parcel details for the side bar, and to set the relevant side bar context based on the loaded data. */
const useSideBarBuildingWithParcelLoader = ({
  showSideBar,
  setSideBarContext,
  associatedParcelId,
  disabled,
}: IUseSideBarBuildingWithParcelLoader) => {
  const [cachedBuildingDetail, setCachedBuildingDetail] = React.useState<IBuilding | null>(null);
  const dispatch = useDispatch();
  const { getParcel } = useApi();
  /** make an api call to load the parcel based on the parcel id */
  const getAssociatedParcel = (associatedParcelId: number, callback: () => void) =>
    getParcel(associatedParcelId)
      .then((parcel: IParcel) => {
        setCachedBuildingDetail({
          ...defaultBuildingValues,
          id: 0,
          parcelId: parcel?.id ?? '',
          parcels: [{ ...parcel }],
        });
        callback();
      })
      .catch(() => {
        toast.error('Failed to create associated building. Please refresh this page to try again.');
      });

  useDeepCompareEffect(() => {
    const loadAssociatedParcel = async (associatedParcelId: number) => {
      getAssociatedParcel(associatedParcelId, () => {
        setSideBarContext(SidebarContextType.ADD_BUILDING);
      });
    };
    if (showSideBar && !!associatedParcelId && associatedParcelId !== cachedBuildingDetail?.id) {
      loadAssociatedParcel(associatedParcelId);
    } else if (!associatedParcelId && !!cachedBuildingDetail) {
      setCachedBuildingDetail(null);
    }
  }, [dispatch, associatedParcelId, disabled, showSideBar]);

  return {
    buildingWithParcelDetail: cachedBuildingDetail,
  };
};

export default useSideBarBuildingWithParcelLoader;
