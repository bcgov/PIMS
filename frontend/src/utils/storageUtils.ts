export const PARCEL_STORAGE_NAME = 'parcelDetailForm';
export const PIN_MOVEMENT_CONFIRM = 'pinMoveConfirm';
export const isStorageInUse = (storageName: string): boolean =>
  !!window.localStorage.getItem(storageName);
export const clearStorage = (storageName: string) => window.localStorage.removeItem(storageName);
