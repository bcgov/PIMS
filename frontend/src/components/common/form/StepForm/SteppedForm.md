SteppedForm example:

```js
import { useFormStepper } from './context';

const FormContent = () => {
  const stepper = useFormStepper();
  return (
    <>
      <input name="data.name" />
      <p>Form inputs and control button here</p>
    </>
  );
};

<SteppedForm
  steps={[
    { route: 'building-id', title: 'Building ID', completed: false, canGoToStep: true },
    { route: 'tenancy', title: 'Tenancy', completed: false, canGoToStep: true },
    { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
    { route: 'parcel', title: 'Parcel', completed: false, canGoToStep: true },
    { route: 'review', title: 'Review', completed: false, canGoToStep: true },
  ]}
  initialValues={{
    activeStep: 0,
    data: { name: 'Building name' },
  }}
  onSubmit={values => alert(JSON.stringify(values.data))}
>
  <FormContent />
</SteppedForm>;
```
