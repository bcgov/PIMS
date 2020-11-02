import { useLocation, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

interface ISideBarParams {
  sidebar?: string;
}

interface IMapSideBar {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
}

/** control the state of the side bar via query params. */
const useQueryParamSideBar = (): IMapSideBar => {
  const [showSideBar, setShowSideBar] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const searchParams = queryString.parse(location.search);
  useEffect(() => {
    setShowSideBar(searchParams.sidebar === 'true');
  }, [searchParams.sidebar]);

  const setShow = (show: boolean) => {
    const search = new URLSearchParams({ ...(searchParams as any), sidebar: show });
    history.push({ search: search.toString() });
  };

  return {
    showSideBar,
    setShowSideBar: setShow,
  };
};

export default useQueryParamSideBar;
