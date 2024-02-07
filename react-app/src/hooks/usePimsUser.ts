import { useKeycloak } from "@bcgov/citz-imb-kc-react"
import usePimsApi from "./usePimsApi";
import useDataLoader from "./useDataLoader";
import { useEffect } from "react";
import { User } from "./api/useUsersApi";

export interface IPimsUser {
    data?: User;
    refreshData: () => void;
    isLoading: boolean;
}

const usePimsUser = () => {
    const keycloak = useKeycloak();
    const api = usePimsApi();
    const { data, refreshData, isLoading } = useDataLoader(api.users.getSelf, () => {});

    useEffect(() => {
        if( (!data && keycloak.isAuthenticated) /* There's another condition I need to put here */ )
        {
            refreshData();
        }
    }, [keycloak, data])

    return {
        data,
        refreshData,
        isLoading,
    }
}

export default usePimsUser;