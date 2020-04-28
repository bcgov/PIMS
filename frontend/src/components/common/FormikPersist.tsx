import * as React from 'react';
import { FormikProps, connect } from 'formik';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';
import { AES, enc } from 'crypto-js';
import GenericModal from './GenericModal';
import packageJson from '../../../package.json';

export interface PersistProps {
  name: string;
  secret: string;
  initialValues: any;
  debounce?: number;
  isSessionStorage?: boolean;
  writeOnly?: boolean;
  loadDraft?: boolean;
}
interface PersistState {
  showLoadDraftDialog: boolean;
}

// Do not allow stored data to be loaded if the application version does not match.
interface VersionedStorage {
  version: string;
  data: any;
}

class PersistImpl extends React.Component<
  PersistProps & { formik: FormikProps<any> },
  PersistState
> {
  constructor(props: PersistProps & { formik: FormikProps<any> }) {
    super(props);
    this.state = { showLoadDraftDialog: false };
  }
  static defaultProps = {
    debounce: 300,
  };

  //Encrypt the formdata before saving.
  //TODO: in the event the security of this data becomes a concern, this data should be persisted server-side.
  saveForm = debounce((data: FormikProps<{}>) => {
    const versionedStorage: VersionedStorage = { version: packageJson.version, data: data };
    if (this.props.isSessionStorage) {
      window.sessionStorage.setItem(
        this.props.name,
        AES.encrypt(JSON.stringify(versionedStorage), this.props.secret).toString(),
      );
    } else {
      window.localStorage.setItem(
        this.props.name,
        AES.encrypt(JSON.stringify(versionedStorage), this.props.secret).toString(),
      );
    }
  }, this.props.debounce);

  loadForm = () => {
    const maybeState = this.props.isSessionStorage
      ? window.sessionStorage.getItem(this.props.name)
      : window.localStorage.getItem(this.props.name);
    if (!this.props.writeOnly && maybeState && maybeState !== null) {
      try {
        const bytes = AES.decrypt(maybeState, this.props.secret);
        const decryptedData: VersionedStorage = JSON.parse(bytes.toString(enc.Utf8));
        if (decryptedData.version !== packageJson.version) {
          this.discardForm();
        } else {
          this.props.formik.setFormikState(decryptedData.data);
        }
      } catch (e) {
        console.debug(e);
        console.debug(`failed to decrypt locally stored item ${this.props.name}`);
      }
    }
  };

  discardForm = () => {
    this.props.isSessionStorage
      ? window.sessionStorage.removeItem(this.props.name)
      : window.localStorage.removeItem(this.props.name);
  };

  componentDidUpdate(prevProps: PersistProps & { formik: FormikProps<any> }) {
    if (this.props.formik.isSubmitting) {
      this.props.isSessionStorage
        ? window.sessionStorage.removeItem(this.props.name)
        : window.localStorage.removeItem(this.props.name);
    } else if (!isEqual(prevProps.formik.values, this.props.formik.values)) {
      this.saveForm(this.props.formik);
    }
  }

  componentDidMount() {
    const maybeState = this.props.isSessionStorage
      ? window.sessionStorage.getItem(this.props.name)
      : window.localStorage.getItem(this.props.name);
    if (maybeState && !this.props.writeOnly) {
      if (this.props.loadDraft) {
        this.loadForm();
      } else {
        this.setState({ showLoadDraftDialog: true });
      }
    }
  }

  render() {
    return (
      <>
        {/** normally not required, this bypasses a snapshot test rendering issue */
        this.state.showLoadDraftDialog && (
          <GenericModal
            title="Load Draft?"
            message="You have an unsaved draft, would you like to resume editing it?"
            cancelButtonText="Discard"
            okButtonText="Resume Editing"
            display={this.state.showLoadDraftDialog}
            handleOk={() => {
              this.setState({ showLoadDraftDialog: false });
              this.loadForm();
            }}
            handleCancel={() => {
              this.setState({ showLoadDraftDialog: false });
              this.discardForm();
            }}
          />
        )}
      </>
    );
  }
}

export const Persist = connect<PersistProps, any>(PersistImpl);
