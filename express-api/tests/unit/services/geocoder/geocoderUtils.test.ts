import { getAddress1, getLatitude, getLongitude } from '@/services/geocoder/geocoderUtils';

describe('UNIT - geocoderUtils', () => {
  describe('getAddress1', () => {
    it('should create and address from passed properties', () => {
      const address = getAddress1({
        civicNumber: '123',
        isStreetTypePrefix: 'false',
        streetType: 'Street',
        streetName: 'Johnson',
        isStreetDirectionPrefix: 'false',
        streetDirection: 'SW',
        streetQualifier: 'Bridge',
        fullAddress: '',
        score: 0,
        matchPrecision: '',
        precisionPoints: 0,
        faults: [],
        siteName: '',
        unitDesignator: '',
        unitNumber: '',
        unitNumberSuffix: '',
        civicNumberSuffix: '',
        localityName: '',
        localityType: '',
        electoralArea: '',
        provinceCode: '',
        locationPositionalAccuracy: '',
        locationDescriptor: '',
        siteID: '',
        blockID: '',
        fullSiteDescriptor: '',
        accessNotes: '',
        siteStatus: '',
        siteRetireDate: '',
        changeDate: '',
        isOfficial: '',
      });
      expect(address).toBe('123 Johnson Street Bridge SW');
    });

    it('should create and address from passed properties, using prefixes', () => {
      const address = getAddress1({
        civicNumber: '123',
        isStreetTypePrefix: 'true',
        streetType: 'Street',
        streetName: 'Johnson',
        isStreetDirectionPrefix: 'true',
        streetDirection: 'SW',
        streetQualifier: 'Bridge',
        fullAddress: '',
        score: 0,
        matchPrecision: '',
        precisionPoints: 0,
        faults: [],
        siteName: '',
        unitDesignator: '',
        unitNumber: '',
        unitNumberSuffix: '',
        civicNumberSuffix: '',
        localityName: '',
        localityType: '',
        electoralArea: '',
        provinceCode: '',
        locationPositionalAccuracy: '',
        locationDescriptor: '',
        siteID: '',
        blockID: '',
        fullSiteDescriptor: '',
        accessNotes: '',
        siteStatus: '',
        siteRetireDate: '',
        changeDate: '',
        isOfficial: '',
      });
      expect(address).toBe('123 Street SW Johnson Bridge');
    });
  });

  describe('getLatitude', () => {
    it('should return the second element of the coordinates array', () => {
      const result = getLatitude({
        type: 'test',
        coordinates: [1, 2],
        crs: { type: '', properties: {} },
      });
      expect(result).toBe(2);
    });

    it('should return 0 in the event there are not the right number of coordinates', () => {
      const result = getLatitude({
        type: 'test',
        coordinates: [1, 2, 3],
        crs: { type: '', properties: {} },
      });
      expect(result).toBe(0);
    });
  });

  describe('getLongitude', () => {
    it('should return the first element of the coordinates array', () => {
      const result = getLongitude({
        type: 'test',
        coordinates: [1, 2],
        crs: { type: '', properties: {} },
      });
      expect(result).toBe(1);
    });

    it('should return 0 in the event there are not the right number of coordinates', () => {
      const result = getLongitude({
        type: 'test',
        coordinates: [1, 2, 3],
        crs: { type: '', properties: {} },
      });
      expect(result).toBe(0);
    });
  });
});
