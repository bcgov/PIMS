import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import React, { createContext } from 'react';

type BannerContextValue = {
  message: string | undefined;
  headerOffsetHeight: number;
};
export const BannerContext = createContext<BannerContextValue>(undefined);

export const BannerContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const api = usePimsApi();
  const { data, loadOnce } = useDataLoader(api.banner);

  if (!data) {
    loadOnce();
  }

  const headerOffsetHeight = data && data.length ? 94 : 74; // The height of the header in pixels, used for layout calculations.

  const contextValue = { message: data, headerOffsetHeight };
  return <BannerContext.Provider value={contextValue}>{props.children}</BannerContext.Provider>;
};

export default BannerContextProvider;
