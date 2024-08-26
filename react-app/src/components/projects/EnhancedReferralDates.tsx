import React from 'react';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { NotificationQueue } from '@/hooks/api/useProjectNotificationApi';
import { NotificationType } from '@/constants/notificationTypes';

interface EnhancedReferralDatesProps {
  rows: NotificationQueue[];
}

const EnhancedReferralDates: React.FC<EnhancedReferralDatesProps> = ({ rows }) => {
  const initalERN = rows.find((row) => row.TemplateId === NotificationType.NEW_PROPERTIES_ON_ERP);
  const thirtyDayERN = rows.find(
    (row) => row.TemplateId === NotificationType.THIRTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );
  const sixtyDayERN = rows.find(
    (row) => row.TemplateId === NotificationType.SIXTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );
  const nintyDayERN = rows.find(
    (row) => row.TemplateId === NotificationType.NINTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );

  const allErnNotificatonsFound = [initalERN, thirtyDayERN, sixtyDayERN, nintyDayERN].every(
    (notification) => notification != undefined,
  );

  if (!allErnNotificatonsFound) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        gap={1}
        display={'inline-flex'}
        mb={3}
        mt={2}
        sx={{
          '& .MuiInputBase-root.Mui-disabled': {
            '& > fieldset': {
              borderColor: 'rgba(0,0,0)',
            },
          },
          '& .MuiFormLabel-root.MuiInputLabel-root': {
            color: 'rgba(0, 0, 0)',
          },
          '& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled': {
            color: 'rgba(0,0,0)',
            WebkitTextFillColor: 'rgba(0,0,0)',
          },
        }}
      >
        <DateField
          disabled={true}
          value={initalERN ? dayjs(initalERN.SendOn) : undefined}
          label={'Initial Send Date'}
          format={'LL'}
        />
        <DateField
          disabled={true}
          value={thirtyDayERN ? dayjs(thirtyDayERN.SendOn) : undefined}
          label={'30-day Send Date'}
          format={'LL'}
        />
        <DateField
          disabled={true}
          value={sixtyDayERN ? dayjs(sixtyDayERN.SendOn) : undefined}
          label={'60-day Send Date'}
          format={'LL'}
        />
        <DateField
          disabled={true}
          value={nintyDayERN ? dayjs(nintyDayERN.SendOn) : undefined}
          label={'90-day Send Date'}
          format={'LL'}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default EnhancedReferralDates;
