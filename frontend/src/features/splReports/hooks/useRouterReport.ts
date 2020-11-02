import queryString from 'query-string';
import { IReport } from './../interfaces';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import _ from 'lodash';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

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
  const history = useHistory();
  const [originalSearch] = useState(history.location.search);
  const dispatch = useDispatch();

  //When this hook loads, override the value of the filter with the search params. Should run once as originalSearch should never change.
  useDeepCompareEffect(() => {
    if (reports?.length && currentReport?.id === undefined) {
      const filterFromParams = queryString.parse(originalSearch);
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
      history.push({ search: params.toString() });
    }
  }, [history, dispatch, currentReport]);

  return;
};
