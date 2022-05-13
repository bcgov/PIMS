import { LifecycleToasts } from 'customAxios';
import { useApi as useAxios } from 'hooks/useApi';
import { toast } from 'react-toastify';

export const useApi = () => {
  const instance = useAxios({ lifecycleToasts: toasts });

  return instance;
};

const toasts: LifecycleToasts = {
  errorToast: () => toast.error('Request Failed', { toastId: 'ERROR' }),
};
