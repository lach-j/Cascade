import React from "react";
import {
  LuCircleCheck,
  LuCircleAlert,
  LuInfo,
  LuEllipsisVertical,
  LuCircleDashed,
  LuLoaderCircle,
} from "react-icons/lu";
import { Alert } from "../../components";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import { useNavigate, useParams } from "react-router";
import { useFeatureContext } from "../../context/useTenants";
import { Menu } from "../../components/Menu";
import Tooltip from "../../components/Tooltip";
import DynamicTable, { ColumnDefinition } from "../../components/DynamicTable";
import { FeatureFlag } from "../Feature/FeatureDetail";
import Navbar from "../../components/Navbar";
import ExternalLink from "../../components/ExternalLink";
import SearchBar from "../../components/SearchBar";
import useFiltering from "../../hooks/useFiltering";

const TenantDetail = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const {
    availableTenants,
    availableFeatures,
    updateFeatureState,
    toggleOverride,
  } = useFeatureContext();

  const tenant = availableTenants.find((t) => t.id === tenantId);

  const tableCols: ColumnDefinition<{
    feature: FeatureFlag;
    isEnabled: boolean;
    override: boolean;
  }>[] = React.useMemo(
    () => [
      {
        Cell: ({ item }) => {
          const [isLoading, setIsLoading] = React.useState<boolean>(false);

          return (
            <button
              disabled={isLoading}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg ${item.isEnabled
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={async () => {
                setIsLoading(true);
                await updateFeatureState(
                  item.feature.id,
                  !item.isEnabled,
                  tenant?.id
                );
                setIsLoading(false);
              }}
            >
              {isLoading ? (
                <LuLoaderCircle className="w-5 h-5 animate-spin" />
              ) : item.isEnabled ? (
                <>
                  <LuCircleCheck className="w-5 h-5" />
                </>
              ) : (
                <>
                  <LuCircleDashed className="w-5 h-5" />
                </>
              )}
            </button>
          );
        },
        shrink: true,
      },
      {
        Cell: ({ item }) => (
          <div>
            <h3 className="font-medium text-gray-900">{item.feature.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{item.feature.id}</span>
              <span>•</span>
              <span className="capitalize">{item.feature.description}</span>
            </div>
          </div>
        ),
      },
      {
        Cell: ({ item }) =>
          item.override && (
            <div className="flex items-center gap-1 text-gray-500">
              <div className="text-sm text-gray-500">Overriden</div>
              <Tooltip text="When a feature is overidden it will NOT change when the global feature toggle is changed. To ensure that this tenant receives feature flag updates, remove this status.">
                <LuInfo className="w-4 h-4 text-gray-500" />
              </Tooltip>
            </div>
          ),
        shrink: true,
      },
      {
        Cell: ({ item }) => (
          <Menu>
            {{
              trigger: <LuEllipsisVertical />,
              items: (
                <>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate(`/features/${item.feature.id}`);
                    }}
                  >
                    Feature View
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      toggleOverride(tenant?.id ?? "", item.feature.id);
                    }}
                  >
                    {item.override ? "Remove Override" : "Override"}
                  </button>
                </>
              ),
            }}
          </Menu>
        ),
        shrink: true,
      },
    ],
    [navigate, tenant?.id, toggleOverride, updateFeatureState]
  );

  const featureStates = availableFeatures.map(({ tenantStates, feature }) => {
    const tenantState = tenantStates.find((t) => t.tenantId === tenant?.id);
    return {
      feature,
      isEnabled: tenantState?.isEnabled || false,
      override: tenantState?.override || false,
    };
  });

  const { setFilter: setSearchTerm, filteredItems: filteredFeatures } = useFiltering(featureStates, (item) => [item.feature.name, item.feature.id]);

  if (!tenant) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Navbar backRoute="/tenants" />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tenant.name}
              </h1>
              <div className="flex gap-2">
                <p className="text-gray-600">{tenant.id}</p>
                {tenant.url && (
                  <ExternalLink href={tenant.url}>{tenant.url}</ExternalLink>
                )}
              </div>
            </div>
          </div>

          <Alert className="mb-6" icon={<LuCircleAlert className="h-4 w-4" />}>
            This tenant currently has{" "}
            {featureStates.filter((x) => x.isEnabled).length} out of{" "}
            {availableFeatures.length} features enabled
          </Alert>
        </div>

        <div className="mb-6">
          <SearchBar placeholder="Search features" onChange={term => setSearchTerm(term)} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feature Management</CardTitle>
          </CardHeader>
          <CardContent>
            <DynamicTable items={filteredFeatures} columns={tableCols} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDetail;
