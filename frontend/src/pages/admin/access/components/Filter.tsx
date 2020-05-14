import * as React from 'react';
import './Filter.scss';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Menu, IMenuItemProps } from 'components/menu/Menu';
import { FaCaretDown, FaSearch, FaUndo } from 'react-icons/fa';
import useCodeLookups from 'hooks/useLookupCodes';
import { useDispatch } from 'react-redux';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import { Button } from 'components/common/form/Button';
import { IFilterData } from 'actions/accessRequestActions';

interface IProps {
  initialValues?: IFilterData;
  applyFilter: (filter: IFilterData) => void;
}

export const defaultFilter: IFilterData = { searchText: '', role: '', agency: '' };

export const AccessRequestFilter = (props: IProps) => {
  const [filterState, setFilterState] = React.useState(props.initialValues || defaultFilter);
  const lookupCodes = useCodeLookups();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getFetchLookupCodeAction());
  }, [dispatch]);

  const agencies: IMenuItemProps[] = lookupCodes.getByType('Agency').map(value => {
    return {
      label: value.name,
      onClick: () => setFilterState({ ...filterState, agency: value.name }),
    };
  });

  const roles: IMenuItemProps[] = lookupCodes.getByType('Role').map(value => {
    return {
      label: value.name,
      onClick: () => setFilterState({ ...filterState, role: value.name }),
    };
  });

  const reset = () => {
    setFilterState(defaultFilter);
    props.applyFilter(defaultFilter);
  };

  const search = () => {
    props.applyFilter(filterState);
  };

  const handleSearchTextChange = (event: any) =>
    setFilterState({ ...filterState, searchText: event.target.value });

  return (
    <Container className="Access-Requests-filter">
      <Row className="filters">
        <Col className="filter">
          <Menu
            searchPlaceholder="Filter agencies"
            enableFilter={true}
            width="260px"
            options={agencies}
          >
            {`Agency: ${filterState.agency || 'Show all'}`}&nbsp;&nbsp;
            <FaCaretDown />
          </Menu>
        </Col>
        <Col>
          <Menu searchPlaceholder="Filter roles" enableFilter={true} width="200px" options={roles}>
            {`Role: ${filterState.role || 'Show all'}`}&nbsp;&nbsp;
            <FaCaretDown />
          </Menu>
        </Col>
        <Col>
          <Form.Control
            type="text"
            placeholder="search"
            value={filterState.searchText}
            onChange={handleSearchTextChange}
          />
        </Col>
        <Col className="actions">
          <Button size="sm" className="bg-warning" icon={<FaSearch size={20} onClick={search} />} />
          <Button variant="outline-primary" size="sm" onClick={reset} icon={<FaUndo size={20} />}>
            Reset
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
