import * as React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import './ManualLink.scss';

export type IManualLinkProps = {
  url: string;
  label: string;
};

const ManualLink: React.FunctionComponent<IManualLinkProps> = ({ url, label }) => {
  const link = url;
  return (
    <div className="manual" onClick={() => window.open(link, '_blank')}>
      <div className="bookOpen">
        <FiBookOpen size={28} />
      </div>
      <div className="label">
        <b>{label}</b>
      </div>
    </div>
  );
};

export default ManualLink;
