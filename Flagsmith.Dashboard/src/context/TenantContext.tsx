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

  const { data: availableIds, refetch: refetchAvailableIds } =
    useFetch<string[]>("api/available-ids");

  const toggleFeature = useDirectFetch<
    void,
    { featureId: string; enabled: boolean; tenantId?: string }
  >(
    ({ featureId, enabled, tenantId }) =>
      `api/feature-flags/${featureId}?enabled=${enabled}${
        tenantId ? `&tenantId=${tenantId}` : ""
      }`,
    {
      method: "PATCH",
    }
  );

  const toggleOverride = useDirectFetch<
    void,
    { featureId: string; tenantId: string }
  >(
    ({ featureId, tenantId }) =>
      `api/tenants/${tenantId}/overrides/${featureId}`,
    {
      method: "DELETE",
    }
  );

  const bulkCreateMissing = useDirectFetch<void, void>(
    () => `api/management/bulk-create-missing`,
    {
      method: "POST",
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
        toggleOverride: async (tenantId, featureId) => {
          await toggleOverride({ featureId, tenantId });
          await refetchFeatures();
        },
        bulkCreateMissing: async () => {
          await bulkCreateMissing();
          await refetchAvailableIds();
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
