import { useFetch } from "../hooks";
import { FeatureContext } from "./useTenants";
import {
  FeatureFlag,
  Tenant,
  TenantState,
} from "../routes/Feature/FeatureDetail";
import useDirectFetch from "../hooks/useDirectFetch";
const FeatureContextProvider = ({ children }: React.PropsWithChildren) => {
  const { data: tenants } = useFetch<Tenant[]>("api/tenants");
  const { data: features, refetch: refetchFeatures } = useFetch<
    {
      feature: FeatureFlag;
      tenantStates: TenantState[];
    }[]
  >("api/feature-flags");

  const { data: availableIds } = useFetch<string[]>("api/available-ids");

  console.log(availableIds);

  const toggleFeature = useDirectFetch<
    void,
    { featureId: string; enabled: boolean; tenantId?: number }
  >(
    ({ featureId, enabled, tenantId }) =>
      `api/feature-flags/${featureId}?enabled=${enabled}${
        tenantId ? `&tenantId=${tenantId}` : ""
      }`,
    {
      method: "PATCH",
    }
  );

  return (
    <FeatureContext.Provider
      value={{
        availableTenants: tenants || [],
        availableFeatures: features || [],
        updateFeatureState: async (featureId, enabled, tenantId) => {
          await toggleFeature({ featureId, enabled, tenantId });
          await refetchFeatures();
        },
        availableIds: availableIds || [],
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureContextProvider;
