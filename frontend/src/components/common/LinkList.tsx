import * as React from 'react';
import './Label.scss';
import { Link } from 'react-router-dom';
import { FaRegTimesCircle } from 'react-icons/fa';
import { Search } from 'history';
import { ListGroup } from 'react-bootstrap';

export interface ILinkListItem {
  search: Search;
  pathName: string;
  label: string;
  key: string | number;
  onRemoveItemClick?: () => void;
  removeItemTitle?: string;
}

interface ILinkedListProps {
  listItems: ILinkListItem[];
  disabled?: boolean;
  noItemsMessage: string;
}

/**
 * Generic component that displays a list of links that open in a new tab. Requires input to be formatted into a list of {@link ILinkListItem}.
 * @param {ILinkedListProps} param0
 */
export const LinkList: React.FunctionComponent<ILinkedListProps &
  React.HTMLAttributes<HTMLDivElement>> = ({ disabled, listItems, noItemsMessage, ...rest }) => {
  return (
    <>
      {listItems.length ? (
        listItems.map((item: ILinkListItem) => (
          <ListGroup.Item key={item.key}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={{
                pathname: item.pathName,
                search: item.search,
              }}
            >
              {item.label}
            </Link>
            {!!item.onRemoveItemClick && (
              <FaRegTimesCircle
                title={item.removeItemTitle}
                style={{ cursor: 'pointer' }}
                className="ml-2"
                onClick={item.onRemoveItemClick}
              />
            )}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>{noItemsMessage}</ListGroup.Item>
      )}
    </>
  );
};
