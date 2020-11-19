import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useState } from 'react';
import queryString from 'query-string';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

interface IMapSideBar {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
  overrideParcelId: (parcelId: number | undefined) => void;
  parcelId?: number;
  disabled?: boolean;
  loadDraft?: boolean;
  newParcel?: boolean;
}

/** control the state of the side bar via query params. */
const useQueryParamSideBar = (): IMapSideBar => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [parcelId, setParcelId] = useState<number | undefined>(undefined);
  const location = useLocation();
  const { id } = useParams();
  const history = useHistory();

  const searchParams = queryString.parse(location.search);
  useDeepCompareEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
    setParcelId(id ? parseInt(id) || undefined : undefined);
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

  const setShow = (show: boolean) => {
    const search = new URLSearchParams({ ...(searchParams as any), sidebar: show });
    history.push({ search: search.toString() });
  };

  return {
    showSideBar,
    setShowSideBar: setShow,
    parcelId,
    overrideParcelId: parcelId => {
      const queryParams = { ...queryString.parse(location.search), loadDraft: true };
      const pathName = !!parcelId ? `/mapview/${parcelId}` : '/mapview';
      history.replace({ pathname: pathName, search: queryString.stringify(queryParams) });
    },
    disabled: searchParams?.disabled === 'true',
    loadDraft: searchParams?.loadDraft === 'true',
    newParcel: searchParams?.new === 'true',
  };
};

export default useQueryParamSideBar;
