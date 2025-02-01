import React from "react";
import {
  LuCircleCheck,
  LuCircleAlert,
  LuInfo,
  LuEllipsisVertical,
  LuLoaderCircle,
  LuCircleDashed,
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
import Navbar from "../../components/Navbar";
import SearchBar from "../../components/SearchBar";
import Code from "../../components/Code";
import DynamicTable, { ColumnDefinition } from "../../components/DynamicTable";

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  conditions?: { type: string; value: string | number }[];
  stats?: {
    enabledTenants: number;
    totalTenants: number;
  };
};

export type Tenant = {
  id: number;
  name: string;
};

export type TenantState = {
  tenantId: number;
  isEnabled: boolean;
  override: boolean;
};

const FeatureDetail = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { featureId } = useParams();
  const navigate = useNavigate();
  const { availableTenants, availableFeatures, updateFeatureState } =
    useFeatureContext();

  const filteredTenants = availableTenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundFeature = availableFeatures.find(
    (f) => f.feature.id === featureId
  );

  const tableCols: ColumnDefinition<Tenant>[] = React.useMemo(
    () => [
      {
        Cell: ({ item }) => {
          const [isLoading, setIsLoading] = React.useState<boolean>(false);

          const tenantState = foundFeature?.tenantStates.find(
            (t) => t.tenantId === item.id
          );

          return (
            <button
              disabled={isLoading}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg ${
                tenantState?.isEnabled
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={async () => {
                setIsLoading(true);
                await updateFeatureState(
                  featureId ?? "",
                  !tenantState?.isEnabled,
                  item.id
                );
                setIsLoading(false);
              }}
            >
              {isLoading ? (
                <LuLoaderCircle className="w-5 h-5 animate-spin" />
              ) : tenantState?.isEnabled ? (
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
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{item.id}</span>
              <span>•</span>
              <span className="capitalize">X tier</span>
            </div>
          </div>
        ),
      },
      {
        Cell: ({ item }) =>
          foundFeature?.tenantStates.find((t) => t.tenantId === item.id)
            ?.override && (
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
                      navigate(`/tenants/${item.id}`);
                    }}
                  >
                    Tenant View
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      console.log("Delete tenant");
                    }}
                  >
                    {foundFeature?.tenantStates.find(
                      (t) => t.tenantId === item.id
                    )?.override
                      ? "Remove Override"
                      : "Override"}
                  </button>
                </>
              ),
            }}
          </Menu>
        ),
        shrink: true,
      },
    ],
    [featureId, foundFeature, navigate, updateFeatureState]
  );

  if (!foundFeature) return <p>Loading...</p>;

  const { feature: selectedFlag, tenantStates } = foundFeature;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Navbar />
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedFlag.name}
                </h1>
                <Code>{selectedFlag.id}</Code>
              </div>
              <p className="text-gray-600">{selectedFlag.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedFlag.isEnabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedFlag.isEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <Alert className="mb-6" icon={<LuCircleAlert className="h-4 w-4" />}>
            This feature is currently enabled for{" "}
            {tenantStates.filter((x) => x.isEnabled).length} out of{" "}
            {availableTenants.length} tenants
          </Alert>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Management</CardTitle>

            <div className="mt-2">
              <SearchBar
                onChange={setSearchTerm}
                placeholder="Search Tenants..."
              />
            </div>
          </CardHeader>
          <CardContent>
            <DynamicTable items={filteredTenants} columns={tableCols} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureDetail;
