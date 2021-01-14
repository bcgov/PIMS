import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { SidebarContextType } from './useQueryParamSideBar';
import { fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { getMergedFinancials } from 'features/properties/components/forms/subforms/EvaluationForm';
import { useDispatch } from 'react-redux';
import React from 'react';
import { IFormParcel } from '../containers/MapSideBarContainer';

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
  const [cachedParcelDetail, setCachedParcelDetail] = React.useState<IFormParcel | null>(null);
  const dispatch = useDispatch();
  const hasBuildings = !!cachedParcelDetail?.buildings?.length;
  useDeepCompareEffect(() => {
    const loadParcel = async () => {
      if (parcelId) {
        setSideBarContext(SidebarContextType.LOADING);
        const response: any = await dispatch(fetchParcelDetail({ id: parcelId as number }));
        setCachedParcelDetail({
          ...response,
          financials: getMergedFinancials([
            ...(response?.evaluations ?? []),
            ...(response?.fiscals ?? []),
          ]),
        });
        if (!!response?.parcelDetail?.buildings?.length) {
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
      if (disabled) {
        setSideBarContext(
          hasBuildings ? SidebarContextType.VIEW_DEVELOPED_LAND : SidebarContextType.VIEW_BARE_LAND,
        );
      } else {
        setSideBarContext(
          hasBuildings
            ? SidebarContextType.UPDATE_DEVELOPED_LAND
            : SidebarContextType.UPDATE_BARE_LAND,
        );
      }
    }
  }, [cachedParcelDetail, disabled, hasBuildings, parcelId]);

  return {
    parcelDetail: cachedParcelDetail,
  };
};

export default useSideBarParcelLoader;
