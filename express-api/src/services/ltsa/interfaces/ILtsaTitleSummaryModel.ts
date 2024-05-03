export interface ILtsaTitleSummaryResponse {
  titleSummaries: ILtsaTitleSummaryModel[];
}

export interface ILtsaTitleSummaryModel {
  titleNumber: string;
  landTitleDistrict: string;
  landTitleDistrictCode: string;
  parcelIdentifier: string;
  status: string;
  firstOwner: string;
}
