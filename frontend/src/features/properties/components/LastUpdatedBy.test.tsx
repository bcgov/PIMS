import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-test-renderer';
import { formatApiDateTime } from 'utils';

import LastUpdatedBy from './LastUpdatedBy';

const getLastUpdatedBy = (
  createdOn?: string,
  updatedOn?: string,
  updatedByName?: string,
  updatedByEmail?: string,
) => {
  return <LastUpdatedBy {...{ createdOn, updatedOn, updatedByName, updatedByEmail }} />;
};

describe('Last Updated By Component', () => {
  afterEach(() => {
    cleanup();
  });
  const date = '2020-10-14T17:45:39.7381599';
  const createdDate = '2020-09-14T17:45:39.7381599';
  const user = 'Test, User';
  const email = 'test@test.ca';

  it('Displays the updated date formatted to the local timezone', () => {
    const { getByText } = render(getLastUpdatedBy(undefined, date, user, email));
    const formattedDate = formatApiDateTime(date);
    expect(getByText(formattedDate, { exact: false })).toBeVisible();
  });

  it('Displays the created date formatted to the local timezone if no update date specified', () => {
    const { getByText } = render(getLastUpdatedBy(createdDate, undefined, user, email));
    const formattedDate = formatApiDateTime(createdDate);
    expect(getByText(formattedDate, { exact: false })).toBeVisible();
  });

  it('Displays the updated date formatted to the local timezone if created date also specified', () => {
    const { getByText } = render(getLastUpdatedBy(createdDate, date, user, email));
    const formattedDate = formatApiDateTime(date);
    expect(getByText(formattedDate, { exact: false })).toBeVisible();
  });

  it('Displays the user that performed the update', () => {
    const { getByText } = render(getLastUpdatedBy(undefined, date, user, email));
    expect(getByText(user)).toBeVisible();
  });

  it('Displays the email of the user that performed the update', async () => {
    const { findByText, getByText } = render(getLastUpdatedBy(undefined, date, user, email));
    await act(async () => {
      fireEvent.mouseOver(getByText(user));
      const tooltip = await findByText(email);
      expect(tooltip).toBeInTheDocument();
    });
  });
});
