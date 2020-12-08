import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
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
}

interface IMapSideBar {
  showSideBar: boolean;
  setShowSideBar: (show: boolean, contextName?: SidebarContextType, size?: SidebarSize) => void;
  overrideParcelId: (parcelId: number | undefined) => void;
  addBuilding: () => void;
  addRawLand: () => void;
  addAssociatedLand: () => void;
  parcelId?: number;
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
  const location = useLocation();
  const { id } = useParams() as any;
  const history = useHistory();

  const searchParams = queryString.parse(location.search);
  useDeepCompareEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
    setParcelId(id ? parseInt(id) || undefined : undefined);
    setSideBarSize(searchParams.sidebarSize as SidebarSize);
    setContextName(searchParams.sidebarContext as SidebarContextType);
    if (searchParams?.new === 'true') {
      const queryParams = { ...searchParams, new: false };
      history.replace({ pathname: '/mapview', search: queryString.stringify(queryParams) });
    }
    if (!!id && searchParams.sidebar === 'false') {
      history.replace({
        pathname: '/mapview',
        search: queryString.stringify(searchParams),
      });
    }
  }, [id, searchParams, location.search]);

  const setShow = (show: boolean, contextName?: SidebarContextType, size?: SidebarSize) => {
    if (show && !contextName) {
      throw new Error('"contextName" is required when "show" is true');
    }

    const search = new URLSearchParams({
      ...(searchParams as any),
      sidebar: show,
      sidebarSize: show ? size : undefined,
      sidebarContext: show ? contextName : undefined,
    });
    history.push({ search: search.toString() });
  };

  const addBuilding = () => {
    setShow(true, SidebarContextType.ADD_BUILDING, 'wide');
  };

  const addRawLand = () => {
    setShow(true, SidebarContextType.ADD_RAW_LAND, 'wide');
  };

  const addAssociatedLand = () => {
    setShow(true, SidebarContextType.ADD_ASSOCIATED_LAND, 'wide');
  };

  return {
    showSideBar,
    context: contextName,
    setShowSideBar: setShow,
    size: sideBarSize,
    parcelId,
    overrideParcelId: parcelId => {
      const queryParams = { ...queryString.parse(location.search), loadDraft: true };
      const pathName = !!parcelId ? `/mapview/${parcelId}` : '/mapview';
      history.replace({ pathname: pathName, search: queryString.stringify(queryParams) });
    },
    disabled: searchParams?.disabled === 'true',
    loadDraft: searchParams?.loadDraft === 'true',
    newParcel: searchParams?.new === 'true',
    addBuilding,
    addRawLand,
    addAssociatedLand,
  };
};

export default useQueryParamSideBar;
