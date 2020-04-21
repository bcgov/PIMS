import * as React from 'react';
import { FormikProps, connect } from 'formik';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';
import { AES, enc } from 'crypto-js';

export interface PersistProps {
  name: string;
  secret: string;
  initialValues: any;
  debounce?: number;
  isSessionStorage?: boolean;
  writeOnly?: boolean;
}

class PersistImpl extends React.Component<PersistProps & { formik: FormikProps<any> }, {}> {
  static defaultProps = {
    debounce: 300,
  };

  //Encrypt the formdata before saving.
  //TODO: in the event the security of this data becomes a concern, this data should be persisted server-side.
  saveForm = debounce((data: FormikProps<{}>) => {
    if (this.props.isSessionStorage) {
      window.sessionStorage.setItem(
        this.props.name,
        AES.encrypt(JSON.stringify(data), this.props.secret).toString(),
      );
    } else {
      window.localStorage.setItem(
        this.props.name,
        AES.encrypt(JSON.stringify(data), this.props.secret).toString(),
      );
    }
  }, this.props.debounce);

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (this.props.formik.isSubmitting) {
      this.props.isSessionStorage
        ? window.sessionStorage.removeItem(this.props.name)
        : window.localStorage.removeItem(this.props.name);
    } else if (!isEqual(prevProps.formik, this.props.formik)) {
      this.saveForm(this.props.formik);
    }
  }

  componentDidMount() {
    if (!this.props.writeOnly) {
      const maybeState = this.props.isSessionStorage
        ? window.sessionStorage.getItem(this.props.name)
        : window.localStorage.getItem(this.props.name);
      if (!this.props.writeOnly && maybeState && maybeState !== null) {
        try {
          const bytes = AES.decrypt(maybeState, this.props.secret);
          const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
          this.props.formik.setFormikState(decryptedData);
        } catch (e) {
          console.debug(e);
          console.debug(`failed to decrypt locally stored item ${this.props.name}`);
        }
      }
    }
  }

  render() {
    return null;
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl);
