import { ILike } from 'typeorm';

export const ILikeWrapper = (query: string | undefined) => {
  if (query == undefined) {
    return undefined;
  } else {
    return ILike(`%${query}%`);
  }
};
