SteppedField example:

```js
import { Formik, Form } from 'formik';

<Formik initialValues={{ activeStep: 2 }}>
  {() => (
    <Form>
      <StepperField
        name="activeStep"
        steps={[
          { route: 'building-id', title: 'Building ID', completed: false, canGoToStep: true },
          { route: 'tenancy', title: 'Tenancy', completed: false, canGoToStep: true },
          { route: 'valuation', title: 'Valuation', completed: false, canGoToStep: true },
          { route: 'parcel', title: 'Parcel', completed: false, canGoToStep: true },
          { route: 'review', title: 'Review', completed: false, canGoToStep: true },
        ]}
      />
    </Form>
  )}
</Formik>;
```
