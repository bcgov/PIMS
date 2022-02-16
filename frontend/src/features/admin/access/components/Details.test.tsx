import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { AccessRequestStatus } from 'constants/accessStatus';
import Enzyme, { mount } from 'enzyme';
import React from 'react';

import { IAccessRequestModel } from '../interfaces';
import { AccessRequestDetails } from './Details';

Enzyme.configure({ adapter: new Adapter() });

describe('Access request details', () => {
  it('Snapshot matches', () => {
    const request: IAccessRequestModel = {
      id: 1,
      username: 'idir/bceid',
      userId: '2',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'user@email.com',
      position: 'position 1',
      role: 'Role',
      agency: 'Agency Name',
      note: 'Note here',
      status: AccessRequestStatus.OnHold,
    };
    const component = mount(
      <div>
        <AccessRequestDetails request={request} onClose={() => {}} />
      </div>,
    );
    expect(component).toMatchSnapshot();
  });
});
