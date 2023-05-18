import { Button } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { Table } from 'components/Table';
import { useFormikContext } from 'formik';
import { PropertyType } from 'hooks/api';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from 'store/hooks';

import { defaultFilter } from '../constants';
import { IProjectForm } from '../interfaces';
import { ProjectPropertyFilter } from '.';
import { AddPropertyColumns } from './constants';
import * as styled from './styled';

interface IProjectAddPropertiesProps {
  onAddProperty?: (property: ISearchPropertyModel) => void;
  onHide?: () => void;
}

export const ProjectAddProperties: React.FC<IProjectAddPropertiesProps> = ({
  onAddProperty,
  onHide,
}) => {
  const navigate = useNavigate();
  const api = useProperties();
  const { values } = useFormikContext<IProjectForm>();
  const { filter } = values;

  const [properties, setProperties] = React.useState<ISearchPropertyModel[]>([]);
  const [paging, setPaging] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [searching, setSearching] = React.useState(false); // TODO: The Table component is built wrong, it causes infinite loops if we don't do this.

  const fetch = async () => {
    const response = await api.findPage({
      page: paging.pageIndex + 1,
      quantity: paging.pageSize,
      pid: !!filter.pid ? filter.pid : undefined,
      address: !!filter.address ? filter.address : undefined,
      agencies: !!filter.agencies ? [parseInt(filter.agencies)] : [values.agencyId],
      classificationId: !!filter.classificationId ? parseInt(filter.classificationId) : undefined,
      administrativeArea: !!filter.administrativeArea ? filter.administrativeArea : undefined,
    });
    return response?.data;
  };

  React.useEffect(() => {
    fetch().then((data) => {
      setProperties(data?.items ?? []);
      setSearching(false);
    });
    // Only automatically call this when the paging changes.
  }, [paging]);

  const handleFilterChange = async () => {
    // The filter is automatically changed because it is managed by formik.
    // Not my design, but too much work to change at this point.
    setSearching(true);
    setPaging((paging) => ({ ...paging, pageIndex: 0 }));
  };

  const handleRequestData = async (props: any) => {
    if (props.pageIndex !== paging.pageIndex && !searching)
      setPaging((paging) => ({ ...paging, pageIndex: props.pageIndex }));
  };

  const handlePageSizeChange = async (size: number) => {
    if (size !== paging.pageSize) setPaging((paging) => ({ ...paging, pageSize: size }));
  };

  const handleRowClick = useCallback(
    (row: ISearchPropertyModel) => {
      const queryParams = new URLSearchParams();
      queryParams.set('sidebar', 'true');
      queryParams.set('disabled', 'true');
      queryParams.set('loadDraft', 'false');
      queryParams.set(
        'buildingId',
        `${row.propertyTypeId === PropertyType.Building ? row.id : undefined}`,
      );
      queryParams.set(
        'parcelId',
        `${
          [PropertyType.Parcel, PropertyType.Subdivision].includes(row.propertyTypeId)
            ? row.id
            : undefined
        }`,
      );
      navigate({
        pathname: '/mapview',
        search: queryParams.toString(),
      });
    },
    [navigate],
  );

  return (
    <styled.ProjectAddProperties>
      <Row>
        <h2>Find Properties</h2>
        <Col flex="1" align="flex-end">
          <Button variant="secondary" onClick={() => (onHide ? onHide() : {})}>
            Hide
          </Button>
        </Col>
      </Row>
      <ProjectPropertyFilter filter={defaultFilter} onChange={handleFilterChange} />
      <Table<ISearchPropertyModel, any>
        name="findProperties"
        columns={AddPropertyColumns({ onAddProperty })}
        data={properties}
        onRowClick={handleRowClick}
        onRequestData={handleRequestData}
        onPageSizeChange={handlePageSizeChange}
        pageIndex={paging.pageIndex}
      />
    </styled.ProjectAddProperties>
  );
};
