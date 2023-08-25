import * as Yup from 'yup';

export const informationPropertiesSchema = Yup.object({
  tierLevelId: Yup.number()
    .typeError('Project tier level required')
    .required('Project tier level required')
    .min(1)
    .max(4),
  riskId: Yup.number()
    .typeError('Project risk required')
    .required('Project risk required')
    .min(1)
    .max(3),
  assessed: Yup.number()
    .required('Project assessed value required')
    .typeError('Project assessed value required')
    .min(0, 'Minimum value is $0.00'),
  market: Yup.number()
    .required('Project estimated market value required')
    .typeError('Project estimated market value required')
    .min(0, 'Minimum value is $0.00'),
  netBook: Yup.number()
    .required('Project net book value required')
    .typeError('Project net book value required')
    .min(0, 'Minimum value is $0.00'),
  properties: Yup.array()
    .of(
      Yup.object({
        name: Yup.string(),
        address: Yup.string().required(),
      }),
    )
    .required()
    .min(1, 'At least one property must be associated with this project'),
});
