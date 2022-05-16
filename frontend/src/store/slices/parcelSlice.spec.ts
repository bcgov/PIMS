import {
  initialParcelState,
  parcelSlice,
  storeDraftProperties,
  storePid,
  storeProperties,
  storePropertyDetail,
} from './parcelSlice';
import { IPropertyDetail, IProperty } from 'actions/parcelsActions';
import { PointFeature } from 'components/maps/types';
import { PropertyTypes } from 'constants/index';
import { mockParcel } from 'mocks/properties';

describe('Parcel slice tests', () => {
  const reducer = parcelSlice.reducer;

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialParcelState);
  });

  it('Should store properties in state', () => {
    const properties: IProperty[] = [
      {
        id: 1,
        agencyId: 1,
        agency: 'agency',
        latitude: 0.34,
        longitude: 3.34,
        isSensitive: false,
      },
    ];
    expect(reducer(undefined, storeProperties(properties))).toEqual({
      ...initialParcelState,
      properties,
    });
  });

  it('Should store draft property in state', () => {
    const features: PointFeature[] = [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [34, 2, 2, 2],
        },
        properties: {
          id: 1,
          propertyTypeId: PropertyTypes.DRAFT_BUILDING,
          agencyId: 1,
          projectStatus: 'status',
          name: 'name',
          projectWorkflow: 'workflow',
        },
      },
    ];
    expect(reducer(undefined, storeDraftProperties(features))).toEqual({
      ...initialParcelState,
      draftProperties: features,
    });
  });

  it('Should store parcel detail in state', () => {
    const detail: IPropertyDetail = {
      propertyTypeId: PropertyTypes.PARCEL,
      parcelDetail: mockParcel,
      position: [2, 1],
    };
    expect(reducer(undefined, storePropertyDetail(detail))).toEqual({
      ...initialParcelState,
      propertyDetail: detail,
    });
  });

  it('Should store PID in state', () => {
    const pid = 234234;
    expect(reducer(undefined, storePid(pid))).toEqual({ ...initialParcelState, pid });
  });
});
