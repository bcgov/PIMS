import * as React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import './SresManual.scss';

const SresManual: React.FunctionComponent = () => {
  const link =
    'https://intranet.gov.bc.ca/assets/intranet/mtics/real-property/sres/process_manual_for_the_surplus_properties_program_-_feb_2020_-_version_2.pdf?';
  return (
    <div className="SresManual" onClick={() => window.open(link, '_blank')}>
      <div>
        <FiBookOpen size={28} />
      </div>
      <p>
        <b>Process Manual</b> <br />
        for the Surplus <br /> Properties Program
      </p>
    </div>
  );
};

export default SresManual;
