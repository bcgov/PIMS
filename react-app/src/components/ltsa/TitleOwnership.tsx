import { useNavigate, useParams } from 'react-router-dom';
import { ILtsaOrderInfo } from './ILtsaOrderInfo';
import usePimsApi from '@/hooks/usePimsApi';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import useDataLoader from '@/hooks/useDataLoader';

interface ILTSADetails {
  ltsa: ILtsaOrderInfo;
  pid?: string;
}

const TitleOwnership = (props: ILTSADetails) => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const api = usePimsApi();
  const userContext = useContext(AuthContext);
  if (!userContext.keycloak.hasRoles([Roles.ADMIN, Roles.AUDITOR], { requireAllRoles: false })) {
    navigate('/');
  }
  const { data, refreshData } = useDataLoader(() => api.ltsa.getLtsabyPid(Number(pid)));

  const TitleDetails = {
    TitleNumber: data?.order.productOrderParameters.titleNumber,
    LegalDescription:
      data?.order.orderedProduct.fieldedData.descriptionsOfLand[0].fullLegalDescription,
    TitleStatus: data?.order.status,
    SalesHistory: data?.order.orderedProduct.fieldedData.tombstone.marketValueAmount,
    ApplicationReceived: data?.order.orderedProduct.fieldedData.tombstone.applicationReceivedDate,
    EnteredOn: data?.order.orderedProduct.fieldedData.tombstone.enteredDate,
  };
};
