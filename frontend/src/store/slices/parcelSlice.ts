import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProperty, IPropertyDetail } from 'actions/parcelsActions';
import { PointFeature } from 'components/maps/types';

export const storeProperties = createAction<IProperty[]>('storeProperty');
export const storeDraftProperties = createAction<PointFeature[]>('storeDraftProperties');
export const storePropertyDetail = createAction<IPropertyDetail | null>('storePropertyDetail');
export const storeAssociatedPropertyDetail = createAction<IPropertyDetail | null>(
  'storeAssociatedPropertyDetail',
);
export const storePid = createAction<number>('storePid');

export interface IParcelState {
  properties: IProperty[];
  draftProperties: PointFeature[];
  propertyDetail: IPropertyDetail | null;
  associatedPropertyDetail: IPropertyDetail | null;
  pid: number;
}

export const initialParcelState: IParcelState = {
  properties: [],
  draftProperties: [],
  propertyDetail: null,
  associatedPropertyDetail: null,
  pid: 0,
};

export const parcelSlice = createSlice({
  name: 'parcel',
  initialState: initialParcelState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storeProperties, (state: IParcelState, action: PayloadAction<IProperty[]>) => {
      return { ...state, properties: action.payload };
    });
    builder.addCase(
      storeDraftProperties,
      (state: IParcelState, action: PayloadAction<PointFeature[]>) => {
        return { ...state, draftProperties: action.payload };
      },
    );
    builder.addCase(
      storePropertyDetail,
      (state: IParcelState, action: PayloadAction<IPropertyDetail | null>) => {
        return { ...state, propertyDetail: action.payload };
      },
    );
    builder.addCase(
      storeAssociatedPropertyDetail,
      (state: IParcelState, action: PayloadAction<IPropertyDetail | null>) => {
        return { ...state, associatedPropertyDetail: action.payload };
      },
    );
    builder.addCase(storePid, (state: IParcelState, action: PayloadAction<number>) => {
      return { ...state, pid: action.payload };
    });
  },
});

export default parcelSlice;
