import React from "react";
import {
  LuCircleCheck,
  LuSearch,
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

const TenantDetail = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { availableTenants, availableFeatures, updateFeatureState } =
    useFeatureContext();

  const tenant = availableTenants.find((t) => t.id === Number(tenantId));

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
              className={`flex items-center gap-2 px-2 py-2 rounded-lg ${
                item.isEnabled
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
                      console.log("Delete tenant");
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
    [navigate, tenant, updateFeatureState]
  );

  const featureStates = availableFeatures.map(({ tenantStates, feature }) => {
    const tenantState = tenantStates.find((t) => t.tenantId === tenant?.id);
    return {
      feature,
      isEnabled: tenantState?.isEnabled || false,
      override: tenantState?.override || false,
    };
  });

  const filteredFeatures = featureStates.filter(({ feature }) =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!tenant) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Navbar />

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tenant.name}
              </h1>
              <p className="text-gray-600">{tenant.id}</p>
            </div>
          </div>

          <Alert className="mb-6" icon={<LuCircleAlert className="h-4 w-4" />}>
            This tenant currently has{" "}
            {featureStates.filter((x) => x.isEnabled).length} out of{" "}
            {availableFeatures.length} features enabled
          </Alert>
        </div>

        <div className="mb-6">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
