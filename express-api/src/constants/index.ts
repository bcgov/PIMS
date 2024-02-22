import networking from '@/constants/networking';
import switches from '@/constants/switches';
import urls from '@/constants/urls';
import * as errors from '@/constants/errors';

const constants = {
  ...networking,
  ...switches,
  ...urls,
  ...errors,
};
export default constants;
