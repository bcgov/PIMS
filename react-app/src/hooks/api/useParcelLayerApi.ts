import { FeatureCollection } from 'geojson';
import { IFetch } from '../useFetch';

const useParcelLayerApi = (absoluteFetch: IFetch) => {
  const getFeatureUrl =
    'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?service=WFS&REQUEST=GetFeature&VERSION=1.3.0&outputFormat=application/json&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW';

  const getParcelByPid = async (pid: string) => {
    const formattedPid = pid.replace(/-/g, '');
    const finalUrl = `${getFeatureUrl}&srsName=EPSG:4326&count=1&CQL_FILTER=PID_NUMBER=${+formattedPid}`;
    const { parsedBody } = await absoluteFetch.get(finalUrl, {}, { headers: {} });
    return parsedBody as FeatureCollection;
  };

  const getParcelByPin = async (pin: string) => {
    const formattedPin = pin.replace(/-/g, '');
    const finalUrl = `${getFeatureUrl}&srsName=EPSG:4326&count=1&CQL_FILTER=PIN=${+formattedPin}`;
    const { parsedBody } = await absoluteFetch.get(finalUrl, {}, { headers: {} });
    return parsedBody as FeatureCollection;
  };

  return {
    getParcelByPid,
    getParcelByPin,
  };
};

export default useParcelLayerApi;
