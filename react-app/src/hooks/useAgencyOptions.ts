import { useContext, useMemo } from 'react';
import { Agency } from '@/hooks/api/useAgencyApi';
import { ISelectMenuItem } from '@/components/form/SelectFormField';
import { LookupContext } from '@/contexts/lookupContext';

/**
 * Use this when you need a list of agencies that does not respect the user's permissions.
 * @returns A hook containing the grouped agencies, active agencies, and agency options.
 */
export const useAgencyOptions = () => {
  const { data: lookupData } = useContext(LookupContext);

  const activeAgencies = useMemo(() => {
    return lookupData?.Agencies?.filter((agency: Agency) => !agency.IsDisabled);
  }, [lookupData?.Agencies]);

  const groupedAgencies = useMemo(() => {
    const groups: { [parentName: string]: Agency[] } = {};
    const parentAgencies: Agency[] = [];

    // Populate groups
    lookupData?.Agencies?.forEach((agency: Agency) => {
      if (!agency.IsDisabled) {
        if (agency.ParentId === null) {
          parentAgencies.push(agency);
        } else {
          const parentAgency = lookupData?.Agencies?.find(
            (parent) => parent.Id === agency.ParentId,
          );
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
  }, [lookupData]);

  const agencyOptions: ISelectMenuItem[] = useMemo(() => {
    const options: ISelectMenuItem[] = [];

    groupedAgencies.forEach((agency) => {
      options.push({
        label: agency.Name,
        value: agency.Id,
        children: agency.children.map((child) => child.Id),
        sendEmail: agency.SendEmail,
      });
      if (agency.children && agency.children.length > 0) {
        agency.children = agency.children.sort((a: Agency, b: Agency) =>
          a.Name.localeCompare(b.Name, undefined, { numeric: true, sensitivity: 'base' }),
        );
        agency.children.forEach((childAgency) => {
          options.push({
            label: childAgency.Name,
            value: childAgency.Id,
            parentId: agency.Id,
            sendEmail: childAgency.SendEmail,
          });
        });
      }
    });

    return options;
  }, [groupedAgencies]);

  return {
    groupedAgencies,
    activeAgencies,
    agencyOptions,
  };
};

export default useAgencyOptions;
