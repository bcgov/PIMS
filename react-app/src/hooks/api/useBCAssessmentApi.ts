import { FeatureCollection } from 'geojson';
import { IFetch } from '../useFetch';

const useBCAssessmentApi = (absoluteFetch: IFetch) => {
  const prodURL =
    'https://apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';
  const testURL =
    'https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json';

  //  https://test.apps.gov.bc.ca/ext/sgw/geo.bca?REQUEST=GetFeature&SERVICE=WFS&VERSION=2.0.0&typeName=geo.bca:WHSE_HUMAN_CULTURAL_ECONOMIC.BCA_FOLIO_GNRL_PROP_VALUES_SV&outputFormat=application/json&srsName=EPSG:4326&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(-123.36905121803285 48.41397415311252))
  const getBCAssessmentByLocation = async (lat: string, lng: string) => {
    const finalUrl = `${testURL}&srsName=EPSG:4326&CQL_FILTER=CONTAINS(SHAPE,SRID=4326;POINT(${lng} ${lat}))`;
    const { parsedBody } = await absoluteFetch.get(
      finalUrl,
      {},
      {
        headers: {
          // 'Access-Control-Allow-Headers': 'Origin',
          // 'Access-Control-Allow-Origin': '*',
        },
        credentials: 'include',
      },
    );
    return parsedBody as FeatureCollection;
  };

  return {
    getBCAssessmentByLocation,
  };
};

export default useBCAssessmentApi;
