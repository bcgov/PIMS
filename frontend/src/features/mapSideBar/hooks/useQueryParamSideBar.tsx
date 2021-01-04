import { useLocation, useHistory } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import queryString from 'query-string';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

export type SidebarSize = 'narrow' | 'wide' | undefined;

export enum SidebarContextType {
  ADD_PROPERTY_TYPE_SELECTOR = 'addPropertyTypeSelector',
  ADD_BUILDING = 'addBuilding',
  ADD_RAW_LAND = 'addRawLand',
  ADD_ASSOCIATED_LAND = 'addAssociatedLand',
  VIEW_BUILDING = 'viewBuilding',
  VIEW_RAW_LAND = 'viewRawLand',
  VIEW_DEVELOPED_LAND = 'viewDevelopedLand',
  UPDATE_BUILDING = 'updateBuilding',
  UPDATE_RAW_LAND = 'updateRawLand',
  UPDATE_DEVELOPED_LAND = 'updateDevelopedLand',
  LOADING = 'loading',
}

interface IMapSideBar {
  showSideBar: boolean;
  setShowSideBar: (
    show: boolean,
    contextName?: SidebarContextType,
    size?: SidebarSize,
    resetParcelId?: boolean,
  ) => void;
  addBuilding: () => void;
  addRawLand: () => void;
  addAssociatedLand: () => void;
  addContext: (context: SidebarContextType) => void;
  setDisabled: (disabled: boolean) => void;
  parcelId?: number;
  buildingId?: number;
  disabled?: boolean;
  loadDraft?: boolean;
  newParcel?: boolean;
  size?: SidebarSize;
  context: SidebarContextType;
}

/** control the state of the side bar via query params. */
const useQueryParamSideBar = (): IMapSideBar => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [contextName, setContextName] = useState<SidebarContextType>(
    SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR,
  );
  const [sideBarSize, setSideBarSize] = useState<SidebarSize>(undefined);
  const [parcelId, setParcelId] = useState<number | undefined>(undefined);
  const [buildingId, setBuildingId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const history = useHistory();

  const searchParams = useMemo(() => queryString.parse(location.search), [location.search]);
  useDeepCompareEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
    setParcelId(searchParams.parcelId ? +searchParams.parcelId || undefined : undefined);
    setBuildingId(searchParams.buildingId ? +searchParams.buildingId || undefined : undefined);
    setSideBarSize(searchParams.sidebarSize as SidebarSize);
    setContextName(searchParams.sidebarContext as SidebarContextType);
    if (searchParams?.new === 'true') {
      const queryParams: any = { ...searchParams, new: false };
      queryParams.parcelId = undefined;
      queryParams.buildingId = undefined;
      queryParams.sidebarContext = SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR;
      history.replace({ pathname: '/mapview', search: queryString.stringify(queryParams) });
    } else if (!!searchParams.parcelId && searchParams.sidebar === 'false') {
      searchParams.parcelId = undefined;
      searchParams.buildingId = undefined;
      history.replace({
        pathname: '/mapview',
        search: queryString.stringify(searchParams),
      });
    }
  }, [searchParams]);

  const setShow = useCallback(
    (show: boolean, contextName?: SidebarContextType, size?: SidebarSize, resetIds?: boolean) => {
      if (show && !contextName) {
        throw new Error('"contextName" is required when "show" is true');
      }

      const search = new URLSearchParams({
        ...(searchParams as any),
        sidebar: show,
        sidebarSize: show ? size : undefined,
        sidebarContext: show ? contextName : undefined,
        parcelId: resetIds ? undefined : searchParams.parcelId,
        buildingId: resetIds ? undefined : searchParams.buildingId,
      });
      history.push({ search: search.toString() });
    },
    [history, searchParams],
  );

  const addBuilding = () => {
    setShow(true, SidebarContextType.ADD_BUILDING, 'wide');
  };

  const addRawLand = () => {
    setShow(true, SidebarContextType.ADD_RAW_LAND, 'wide');
  };

  const addAssociatedLand = () => {
    setShow(true, SidebarContextType.ADD_ASSOCIATED_LAND, 'wide');
  };

  const addContext = useCallback(
    (context: SidebarContextType) => {
      setShow(showSideBar, context, 'wide');
    },
    [setShow, showSideBar],
  );

  return {
    showSideBar,
    context: contextName,
    setShowSideBar: setShow,
    size: sideBarSize,
    parcelId,
    buildingId,
    disabled: searchParams?.disabled === 'true',
    loadDraft: searchParams?.loadDraft === 'true',
    newParcel: searchParams?.new === 'true',
    addBuilding,
    addRawLand,
    addAssociatedLand,
    addContext,
    setDisabled: disabled => {
      const queryParams = {
        ...queryString.parse(location.search),
        loadDraft: true,
        disabled: disabled,
      };
      const pathName = '/mapview';
      history.replace({ pathname: pathName, search: queryString.stringify(queryParams) });
    },
  };
};

export default useQueryParamSideBar;
