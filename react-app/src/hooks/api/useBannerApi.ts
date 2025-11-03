import { IFetch } from '@/hooks/useFetch';

const useBannerApi = (absoluteFetch: IFetch) => {
  const getBannerMessage = async () => {
    const { parsedBody } = await absoluteFetch.get('/banner');
    return parsedBody as string;
  };
  return getBannerMessage;
};

export default useBannerApi;
