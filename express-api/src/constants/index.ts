import networking from '@/constants/networking';
import switches from '@/constants/switches';
import urls from '@/constants/urls';
import * as errors from '@/constants/errors';
import * as types from '@/constants/types'

const constants = {
  ...networking,
  ...switches,
  ...urls,
  ...errors,
  ...types,
};
export default constants;
