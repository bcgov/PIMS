import { useLocation, useHistory } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import queryString from 'query-string';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import * as H from 'history';
import dequal from 'dequal';

export type SidebarSize = 'narrow' | 'wide' | undefined;

export enum SidebarContextType {
  ADD_PROPERTY_TYPE_SELECTOR = 'addPropertyTypeSelector',
  ADD_BUILDING = 'addBuilding',
  ADD_BARE_LAND = 'addBareLand',
  ADD_ASSOCIATED_LAND = 'addAssociatedLand',
  ADD_SUBDIVISION_LAND = 'addSubdivisionLand',
  VIEW_BUILDING = 'viewBuilding',
  VIEW_BARE_LAND = 'viewBareLand',
  VIEW_DEVELOPED_LAND = 'viewDevelopedLand',
  VIEW_SUBDIVISION_LAND = 'viewSubdivisionLand',
  UPDATE_BUILDING = 'updateBuilding',
  UPDATE_BARE_LAND = 'updateBareLand',
  UPDATE_DEVELOPED_LAND = 'updateDevelopedLand',
  UPDATE_SUBDIVISION_LAND = 'updateSubdivisionLand',
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
  addBareLand: () => void;
  addAssociatedLand: () => void;
  addSubdivision: () => void;
  addContext: (context: SidebarContextType) => void;
  setDisabled: (disabled: boolean) => void;
  parcelId?: number;
  buildingId?: number;
  associatedParcelId?: number;
  disabled?: boolean;
  loadDraft?: boolean;
  newParcel?: boolean;
  size?: SidebarSize;
  context: SidebarContextType;
  handleLocationChange:
    | string
    | ((location: H.Location, action: 'PUSH' | 'POP' | 'REPLACE') => string | boolean);
}

/** control the state of the side bar via query params. */
export const useQueryParamSideBar = (formikRef?: any): IMapSideBar => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [contextName, setContextName] = useState<SidebarContextType>(
    SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR,
  );
  const [sideBarSize, setSideBarSize] = useState<SidebarSize>(undefined);
  const [parcelId, setParcelId] = useState<number | undefined>(undefined);
  const [buildingId, setBuildingId] = useState<number | undefined>(undefined);
  const [associatedParcelId, setAssociatedParcelId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const history = useHistory();

  const searchParams = useMemo(() => queryString.parse(location.search), [location.search]);
  useDeepCompareEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
    setParcelId(searchParams.parcelId ? +searchParams.parcelId || undefined : undefined);
    setBuildingId(
      searchParams.buildingId !== undefined && searchParams.buildingId !== null
        ? +searchParams.buildingId
        : undefined,
    );
    setAssociatedParcelId(
      searchParams.associatedParcelId ? +searchParams.associatedParcelId || undefined : undefined,
    );
    setSideBarSize(searchParams.sidebarSize as SidebarSize);
    setContextName(searchParams.sidebarContext as SidebarContextType);
    if (searchParams?.new === 'true') {
      const queryParams: any = { ...searchParams, new: false };
      queryParams.parcelId = undefined;
      queryParams.buildingId = undefined;
      queryParams.sidebarContext = SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR;
      history.replace({ pathname: '/mapview', search: queryString.stringify(queryParams) });
    } else if (
      searchParams.sidebar === 'false' &&
      (searchParams.parcelId || searchParams.buildingId || searchParams.associatedParcelId)
    ) {
      searchParams.parcelId = undefined;
      searchParams.buildingId = undefined;
      searchParams.associatedParcelId = undefined;
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

      const search = {
        ...(searchParams as any),
        sidebar: show,
        sidebarSize: show ? size : undefined,
        sidebarContext: show ? contextName : undefined,
        parcelId: resetIds ? undefined : searchParams.parcelId,
        buildingId: resetIds ? undefined : searchParams.buildingId,
      };
      history.push({ search: queryString.stringify(search) });
    },
    [history, searchParams],
  );

  const addBuilding = () => {
    setShow(true, SidebarContextType.ADD_BUILDING, 'wide');
  };

  const addBareLand = () => {
    setShow(true, SidebarContextType.ADD_BARE_LAND, 'wide');
  };

  const addAssociatedLand = () => {
    setShow(true, SidebarContextType.ADD_ASSOCIATED_LAND, 'wide');
  };

  const addSubdivision = () => {
    setShow(true, SidebarContextType.ADD_SUBDIVISION_LAND, 'wide');
  };

  const addContext = useCallback(
    (context: SidebarContextType) => {
      setShow(showSideBar, context, 'wide');
    },
    [setShow, showSideBar],
  );

  const handleLocationChange = (location: H.Location, action: 'PUSH' | 'POP' | 'REPLACE') => {
    const parsedChangedLocation = queryString.parse(location.search);
    return (searchParams.sidebarContext !== parsedChangedLocation.sidebarContext ||
      searchParams.parcelId !== parsedChangedLocation.parcelId ||
      searchParams.buildingId !== parsedChangedLocation.buildingId ||
      searchParams.sideBar !== parsedChangedLocation.sideBar) &&
      !dequal(formikRef?.current?.initialValues?.data, formikRef?.current?.values?.data)
      ? 'Are you sure you want to leave this page? You have unsaved changes.'
      : true;
  };

  return {
    showSideBar,
    context: contextName,
    setShowSideBar: setShow,
    size: sideBarSize,
    parcelId,
    buildingId,
    associatedParcelId,
    disabled: searchParams?.disabled === 'true',
    loadDraft: searchParams?.loadDraft === 'true',
    newParcel: searchParams?.new === 'true',
    addBuilding,
    addBareLand,
    addAssociatedLand,
    addSubdivision,
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
    handleLocationChange,
  };
};

export default useQueryParamSideBar;
