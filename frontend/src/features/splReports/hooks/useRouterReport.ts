import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import _ from 'lodash';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store';

import { IReport } from './../interfaces';

interface RouterFilterProps {
  currentReport?: IReport;
  setCurrentReport: (report: IReport) => void;
  reports: IReport[];
}

/**
 * Control the active report on the SPL reports page using url search params.
 * NOTE: URLSearchParams not supported by IE.
 */
export const useRouterReport = ({
  currentReport,
  setCurrentReport,
  reports,
}: RouterFilterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [originalSearch] = useState(location.search);
  const dispatch = useAppDispatch();

  //When this hook loads, override the value of the filter with the search params. Should run once as originalSearch should never change.
  useDeepCompareEffect(() => {
    if (reports?.length && currentReport?.id === undefined) {
      const queryParams = new URLSearchParams(originalSearch);
      const filterFromParams: any = {};
      for (const [key, value] of queryParams.entries()) {
        filterFromParams[key] = value;
      }
      if (filterFromParams.reportId) {
        const report = _.find(reports, { id: +filterFromParams.reportId });
        setCurrentReport(report ?? reports[0]);
      } else {
        reports?.length && setCurrentReport(reports[0]);
      }
    }
  }, [originalSearch, reports, setCurrentReport]);

  //If the filter ever changes, push those changes to the search params
  React.useEffect(() => {
    if (currentReport?.id) {
      const params = new URLSearchParams({ reportId: `${currentReport?.id ?? ''}` });
      navigate({ search: params.toString() });
    }
  }, [navigate, dispatch, currentReport]);

  return;
};
