import { ConfigContext } from '@/contexts/configContext';
import { FeatureCollection } from 'geojson';
import { useContext } from 'react';

const useBCAssessmentApi = () => {
  const config = useContext(ConfigContext);
  const isProd = config?.NODE_ENV === 'production';
  const prodURL =
    'https://apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';
  const testURL =
    'https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';

  //  https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(-123.36905121803285 48.41397415311252))
  const getBCAssessmentByLocation = async (lng: string, lat: string) => {
    const finalUrl = `${isProd ? prodURL : testURL}&srsName=EPSG:4326&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(${lng} ${lat}))`;
    // const { parsedBody } = await absoluteFetch.get(
    //   finalUrl,
    //   {},
    //   {
    //     headers: {
    //       // 'Access-Control-Allow-Headers': 'Origin',
    //       // 'Access-Control-Allow-Origin': '*',
    //       Origin: 'https://pims-v2-dev.apps.silver.devops.gov.bc.ca',
    //       Referer: 'https://pims-v2-dev.apps.silver.devops.gov.bc.ca',
    //     },
    //     credentials: 'include',
    //   },
    // );
    const response = await fetch(finalUrl, {
      credentials: 'include',
    });
    const body = await response.json();
    console.log(body);
    return body as FeatureCollection;
  };

  return {
    getBCAssessmentByLocation,
  };
};

export default useBCAssessmentApi;
