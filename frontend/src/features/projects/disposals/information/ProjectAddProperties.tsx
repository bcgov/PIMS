import { Table } from 'components/Table';
import { ISearchPropertyModel } from 'hooks/api/properties/search';
import React from 'react';
import { ProjectPropertyFilter } from '.';
import { AddPropertyColumns } from './constants';
import { defaultFilter } from '../constants';
import { useProperties } from 'store/hooks';
import { IProjectForm, IProjectPropertyFilter } from '../interfaces';
import queryString from 'query-string';
import { PropertyType } from 'hooks/api';
import * as styled from './styled';
import { useFormikContext } from 'formik';
import { Col, Row } from 'components/flex';
import { Button } from 'components/common/form';

interface IProjectAddPropertiesProps {
  onAddProperty?: (property: ISearchPropertyModel) => void;
  onHide?: () => void;
}

export const ProjectAddProperties: React.FC<IProjectAddPropertiesProps> = ({
  onAddProperty,
  onHide,
}) => {
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
    fetch().then(data => {
      setProperties(data?.items ?? []);
      setSearching(false);
    });
    // Only automatically call this when the paging changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paging]);

  const handleFilterChange = async (filter: IProjectPropertyFilter) => {
    // The filter is automatically changed because it is managed by formik.
    // Not my design, but too much work to change at this point.
    setSearching(true);
    setPaging(paging => ({ ...paging, pageIndex: 0 }));
  };

  const handleRequestData = async (props: any) => {
    if (props.pageIndex !== paging.pageIndex && !searching)
      setPaging(paging => ({ ...paging, pageIndex: props.pageIndex }));
  };

  const handlePageSizeChange = async (size: number) => {
    if (size !== paging.pageSize) setPaging(paging => ({ ...paging, pageSize: size }));
  };

  const handleRowClick = React.useCallback((row: ISearchPropertyModel) => {
    window.open(
      `/mapview?${queryString.stringify({
        sidebar: true,
        disabled: true,
        loadDraft: false,
        parcelId: [PropertyType.Parcel, PropertyType.Subdivision].includes(row.propertyTypeId)
          ? row.id
          : undefined,
        buildingId: row.propertyTypeId === PropertyType.Building ? row.id : undefined,
      })}`,
      '_blank',
    );
  }, []);

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
      <Table<ISearchPropertyModel>
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
