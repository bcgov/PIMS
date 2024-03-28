import { useMemo } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { Agency } from '@/hooks/api/useAgencyApi';
import { ISelectMenuItem } from '@/components/form/SelectFormField';

export const useGroupedAgenciesApi = () => {
  const api = usePimsApi();
  const { loadOnce: agencyLoad, data: agencyData } = useDataLoader(api.agencies.getAgencies);
  agencyLoad();

  const groupedAgencies = useMemo(() => {
    const groups: { [parentName: string]: Agency[] } = {};
    const parentAgencies: Agency[] = [];

    // Populate groups
    agencyData?.forEach((agency) => {
      if (!agency.IsDisabled) {
        if (agency.ParentId === null) {
          parentAgencies.push(agency);
        } else {
          const parentAgency = agencyData.find((parent) => parent.Id === agency.ParentId);
          if (parentAgency) {
            if (!groups[parentAgency.Name]) {
              groups[parentAgency.Name] = [];
            }
            groups[parentAgency.Name].push(agency);
          }
        }
      }
    });

    parentAgencies.sort((a: Agency, b: Agency) => a.Name.localeCompare(b.Name));

    // Include parent agencies and their children in the groupedAgencies array
    const groupedAgencies: Agency[] = parentAgencies.map((parent) => ({
      ...parent,
      children: groups[parent.Name] ?? [],
    }));

    return groupedAgencies;
  }, [agencyData]);

  const agencyOptions: ISelectMenuItem[] = useMemo(() => {
    const options: ISelectMenuItem[] = [];

    groupedAgencies.forEach((agency) => {
      options.push({
        label: agency.Name,
        value: agency.Id,
        parent: true,
        children: agency.children.map((child) => child.Id),
      });
      if (agency.children && agency.children.length > 0) {
        // Custom sorting logic for children agencies that contain numeric values
        agency.children = agency.children.sort((a: Agency, b: Agency) => {
          const numA = parseInt(a.Name.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.Name.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
        agency.children.forEach((childAgency) => {
          options.push({
            label: childAgency.Name,
            value: childAgency.Id,
            parent: false,
          });
        });
      }
    });

    return options;
  }, [groupedAgencies]);

  return { groupedAgencies, agencyOptions };
};

export default useGroupedAgenciesApi;
