import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { AccessRequestDetails } from './Details';
import { AccessRequestStatus } from 'constants/accessStatus';
import { IAccessRequestModel } from '../interfaces';

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
