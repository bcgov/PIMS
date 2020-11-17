import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

export type SidebarSize = 'narrow' | 'wide' | undefined;

export enum SidebarContextType {
  ADD_PROPERTY_TYPE_SELECTOR = 'addPropertyTypeSelector',
  ADD_BUILDING = 'addBuilding',
  ADD_RAW_LAND = 'addRawLand',
  VIEW_BUILDING = 'viewBuilding',
  VIEW_RAW_LAND = 'viewRawLand',
}

interface IMapSideBar {
  showSideBar: boolean;
  setShowSideBar: (show: boolean, contextName?: SidebarContextType, size?: SidebarSize) => void;
  overrideParcelId: (parcelId: number | undefined) => void;
  addBuilding: () => void;
  addRawLand: () => void;
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
  useEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
    setParcelId(id ? parseInt(id) || undefined : undefined);
    setSideBarSize(searchParams.sidebarSize as SidebarSize);
    setContextName(searchParams.sidebarContext as SidebarContextType);
    if (searchParams?.new === 'true') {
      const queryParams = { ...queryString.parse(location.search), new: false };
      history.replace({ pathname: '/mapview', search: queryString.stringify(queryParams) });
    }
  }, [id, searchParams, location.search, history]);

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
  };
};

export default useQueryParamSideBar;
