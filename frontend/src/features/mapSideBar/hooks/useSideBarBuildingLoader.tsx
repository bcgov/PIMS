import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { SidebarContextType } from './useQueryParamSideBar';
import { fetchBuildingDetail } from 'actionCreators/parcelsActionCreator';
import { getMergedFinancials } from 'features/properties/components/forms/subforms/EvaluationForm';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { IFormBuilding } from '../containers/MapSideBarContainer';
import { RootState } from 'reducers/rootReducer';
import { IPropertyDetail } from 'actions/parcelsActions';

interface IUseSideBarBuildingLoader {
  /** whether or not the sidebar should be displayed */
  showSideBar: boolean;
  /** set the active context of the side bar */
  setSideBarContext: (context: SidebarContextType) => void;
  /** The active context of the side bar */
  sideBarContext: SidebarContextType;
  /** the buildingid specified as a url query param, indicates which parcel to display in the side bar. */
  buildingId?: number;
  /** the edit state of the property in the side bar. */
  disabled?: boolean;
}

/** hook used to load building details for the side bar, and to set the relevant side bar context based on the loaded data. */
const useSideBarBuildingLoader = ({
  showSideBar,
  sideBarContext,
  setSideBarContext,
  buildingId,
  disabled,
}: IUseSideBarBuildingLoader) => {
  const [cachedBuildingDetail, setCachedBuildingDetail] = React.useState<IFormBuilding | null>(
    null,
  );
  const dispatch = useDispatch();
  const associatedBuildingDetail = useSelector<RootState, IPropertyDetail | null>(
    state => state.parcel.associatedBuildingDetail,
  );
  useDeepCompareEffect(() => {
    const loadBuilding = async () => {
      setSideBarContext(SidebarContextType.LOADING);
      const response: any = await dispatch(fetchBuildingDetail({ id: buildingId as number }));
      setCachedBuildingDetail({
        ...response,
        financials: getMergedFinancials([
          ...(response?.evaluations ?? []),
          ...(response?.fiscals ?? []),
        ]),
      });
      setSideBarContext(
        disabled ? SidebarContextType.VIEW_BUILDING : SidebarContextType.UPDATE_BUILDING,
      );
    };
    if (showSideBar && !!buildingId && buildingId !== cachedBuildingDetail?.id) {
      loadBuilding();
    } else if (!buildingId && buildingId !== 0 && !!cachedBuildingDetail) {
      setCachedBuildingDetail(null);
    } else if (!buildingId && associatedBuildingDetail) {
      setCachedBuildingDetail({
        ...associatedBuildingDetail.parcelDetail,
        id: 0,
        financials: [],
      } as any);
    }
  }, [dispatch, buildingId, disabled, showSideBar]);

  /**
   * Handle the user swapping between view and update of the same property.
   */
  useDeepCompareEffect(() => {
    if (!!buildingId && cachedBuildingDetail?.id === buildingId) {
      if (
        [SidebarContextType.VIEW_BUILDING, SidebarContextType.UPDATE_BUILDING].includes(
          sideBarContext,
        )
      ) {
        const newContext = disabled
          ? SidebarContextType.VIEW_BUILDING
          : SidebarContextType.UPDATE_BUILDING;
        newContext !== sideBarContext && setSideBarContext(newContext);
      }
    } else if (!!cachedBuildingDetail && !cachedBuildingDetail?.id) {
      setSideBarContext(SidebarContextType.ADD_BUILDING);
    }
  }, [buildingId, cachedBuildingDetail, disabled, sideBarContext]);

  return {
    buildingDetail: cachedBuildingDetail,
  };
};

export default useSideBarBuildingLoader;
