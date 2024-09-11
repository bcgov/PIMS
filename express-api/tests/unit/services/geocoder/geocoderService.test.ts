import geocoderService from '@/services/geocoder/geocoderService';

const mockJson = {
  type: 'FeatureCollection',
  queryAddress: '4000 seymour pl victoria, bc',
  searchTimestamp: '2024-02-16 07:55:18',
  executionTime: 3.411,
  version: '4.3.0-SNAPSHOT',
  baseDataDate: '2024-01-09',
  crs: {
    type: 'EPSG',
    properties: {
      code: 4326,
    },
  },
  interpolation: 'adaptive',
  echo: 'true',
  locationDescriptor: 'any',
  setBack: 0,
  minScore: 0,
  maxResults: 1,
  disclaimer: 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535',
  privacyStatement: 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932',
  copyrightNotice: 'Copyright © 2024 Province of British Columbia',
  copyrightLicense: 'https://www2.gov.bc.ca/gov/content?id=A519A56BC2BF44E4A008B33FCF527F61',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        crs: {
          type: 'EPSG',
          properties: {
            code: 4326,
          },
        },
        coordinates: [-123.3692171, 48.4533429],
      },
      properties: {
        fullAddress: '4000 Seymour Pl, Saanich, BC',
        score: 96,
        matchPrecision: 'CIVIC_NUMBER',
        precisionPoints: 100,
        faults: [
          {
            value: 'VICTORIA',
            element: 'LOCALITY',
            fault: 'isAlias',
            penalty: 4,
          },
        ],
        siteName: '',
        unitDesignator: '',
        unitNumber: '',
        unitNumberSuffix: '',
        civicNumber: 4000,
        civicNumberSuffix: '',
        streetName: 'Seymour',
        streetType: 'Pl',
        isStreetTypePrefix: 'false',
        streetDirection: '',
        isStreetDirectionPrefix: '',
        streetQualifier: '',
        localityName: 'Saanich',
        localityType: 'District Municipality',
        electoralArea: '',
        provinceCode: 'BC',
        locationPositionalAccuracy: 'high',
        locationDescriptor: 'parcelPoint',
        siteID: 'eccd759a-8476-46b0-af5d-e1c071f8e78e',
        blockID: 512804,
        fullSiteDescriptor: '',
        accessNotes: '',
        siteStatus: 'active',
        siteRetireDate: '9999-12-31',
        changeDate: '2024-01-10',
        isOfficial: 'true',
      },
    },
  ],
};
const stringjson = JSON.stringify(mockJson);

describe('UNIT - Geoserver services', () => {
  describe('getSiteAddresses', () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve(new Response(stringjson)));

    it('should get an address from Geocoder service.', async () => {
      const address = await geocoderService.getSiteAddresses('4000 Seymour pl BC');
      expect(Array.isArray(address)).toBe(true);
      expect(address[0].siteId).toBeDefined();
    });
    it('should return an error when service is unreachable.', async () => {
      fetchMock.mockImplementationOnce(() => Promise.resolve(new Response('', { status: 500 })));
      expect(async () => {
        await geocoderService.getSiteAddresses('');
      }).rejects.toThrow();
    });
  });

  describe('getPids', () => {
    const pidData = {
      siteID: 'eccd759a-8476-46b0-af5d-e1c071f8e78e',
      pids: '000382345',
    };
    const stringPids = JSON.stringify(pidData);

    it('should get a list of PIDs connected to the site address.', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.resolve(new Response(stringPids)));
      const pids = await geocoderService.getPids('eccd759a-8476-46b0-af5d-e1c071f8e78e');
      expect(typeof pids === 'object' && !Array.isArray(pids) && pids !== null).toBe(true);
      expect(typeof pids.pids === 'string' && pids.pids === '000382345').toBe(true);
    });

    it('should thow an error if geocoder service is down.', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(() => Promise.resolve(new Response('', { status: 500 })));
      expect(async () => {
        await geocoderService.getPids('');
      }).rejects.toThrow();
    });
  });
});
