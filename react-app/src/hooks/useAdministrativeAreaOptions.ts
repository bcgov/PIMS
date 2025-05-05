import { useContext, useMemo } from 'react';
import { ISelectMenuItem } from '@/components/form/SelectFormField';
import { LookupContext } from '@/contexts/lookupContext';
import { AdministrativeArea } from '@/hooks/api/useAdministrativeAreaApi';

const useAdministrativeAreaOptions = () => {
  const { data: lookupData } = useContext(LookupContext);

  const activeAdminAreas = useMemo(() => {
    return lookupData?.AdministrativeAreas?.filter((a: AdministrativeArea) => !a.IsDisabled);
  }, [lookupData?.AdministrativeAreas]);

  const adminAreaOptions: ISelectMenuItem[] = useMemo(() => {
    const options: ISelectMenuItem[] = [];

    activeAdminAreas.forEach((a) => {
      options.push({
        label: a.Name,
        value: a.Id,
      });
    });

    return options;
  }, [activeAdminAreas]);

  return {
    activeAdminAreas,
    adminAreaOptions,
  };
};

export default useAdministrativeAreaOptions;
