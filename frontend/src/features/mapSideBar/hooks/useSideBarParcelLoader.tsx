import { IParcel } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import { useAsyncError } from 'hooks/useAsyncError';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import React from 'react';
import { useAppDispatch } from 'store';
import { fetchParcelDetail } from 'store/slices/hooks/parcelsActionCreator';

import { SidebarContextType } from './useQueryParamSideBar';

interface IUseSideBarParcelLoader {
  /** whether or not the sidebar should be displayed */
  showSideBar: boolean;
  /** set the active context of the side bar */
  setSideBarContext: (context: SidebarContextType) => void;
  /** the parcelid specified as a url query param, indicates which parcel to display in the side bar. */
  parcelId?: number;
  /** the edit state of the property in the side bar. */
  disabled?: boolean;
}

/** hook used to load parcel details for the side bar, and to set the relevant side bar context based on the loaded data. */
const useSideBarParcelLoader = ({
  showSideBar,
  setSideBarContext,
  parcelId,
  disabled,
}: IUseSideBarParcelLoader) => {
  const [cachedParcelDetail, setCachedParcelDetail] = React.useState<IParcel | null>(null);
  const dispatch = useAppDispatch();
  const hasBuildings = !!cachedParcelDetail?.buildings?.length;
  const throwError = useAsyncError();

  useDeepCompareEffect(() => {
    const loadParcel = async () => {
      if (parcelId) {
        setSideBarContext(SidebarContextType.LOADING);
        try {
          const response = await fetchParcelDetail({ id: parcelId as number })(dispatch);
          setCachedParcelDetail({
            ...response,
          });
        } catch (err) {
          throwError(err);
        }
      }
    };
    if (showSideBar && parcelId && parcelId !== cachedParcelDetail?.id) {
      loadParcel();
    } else if (!parcelId) {
      if (!!cachedParcelDetail) {
        setCachedParcelDetail(null);
      }
    }
  }, [dispatch, parcelId, disabled, showSideBar]);

  /**
   * Handle the user swapping between view and update of the same property.
   */
  useDeepCompareEffect(() => {
    if (!!parcelId && cachedParcelDetail?.id === parcelId) {
      setContext(cachedParcelDetail);
    }
  }, [cachedParcelDetail, disabled, hasBuildings, parcelId]);

  /**
   * set the side bar context based on the parcel structure.
   * @param parcel
   */
  const setContext = (parcel: IParcel) => {
    if (parcel?.propertyTypeId === PropertyTypes.SUBDIVISION) {
      setSideBarContext(
        disabled
          ? SidebarContextType.VIEW_SUBDIVISION_LAND
          : SidebarContextType.UPDATE_SUBDIVISION_LAND,
      );
    } else if (!!parcel?.buildings?.length) {
      setSideBarContext(
        disabled
          ? SidebarContextType.VIEW_DEVELOPED_LAND
          : SidebarContextType.UPDATE_DEVELOPED_LAND,
      );
    } else {
      setSideBarContext(
        disabled ? SidebarContextType.VIEW_BARE_LAND : SidebarContextType.UPDATE_BARE_LAND,
      );
    }
  };

  return {
    parcelDetail: cachedParcelDetail,
  };
};

export default useSideBarParcelLoader;
