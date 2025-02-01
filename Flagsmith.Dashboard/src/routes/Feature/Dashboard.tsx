import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import { LuChartBar, LuCircleCheck, LuCircleX, LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFeatureContext } from "../../context/useTenants";
import NavTabs, { NavTab } from "../../components/Tabs";
import Code from "../../components/Code";
const FeatureFlagDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { availableFeatures, availableIds } = useFeatureContext();

  const flags = availableFeatures?.filter(({ feature }) =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <NavTabs initialActiveTab="tenants">
            <NavTab route="/features">Features</NavTab>
            <NavTab route="/tenants">Tenants</NavTab>
          </NavTabs>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Feature Flag Management
          </h1>
          <p className="text-gray-600">
            Manage feature flags across all tenants
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flags?.map(({ feature: flag, tenantStates }) => (
            <Card
              key={flag.id}
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/features/${flag.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">
                      {flag.name}
                    </CardTitle>
                    <CardDescription>{flag.description}</CardDescription>
                  </div>
                  <button
                    className={`p-2 rounded-full ${
                      flag.isEnabled ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {flag.isEnabled ? (
                      <LuCircleCheck className="w-6 h-6 text-green-600" />
                    ) : (
                      <LuCircleX className="w-6 h-6 text-red-600" />
                    )}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <LuChartBar className="w-4 h-4" />
                      Tenant Adoption
                    </span>
                    <span className="font-medium">
                      {tenantStates.filter((ts) => ts.isEnabled).length}/
                      {tenantStates.length} tenants
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (tenantStates.filter((ts) => ts.isEnabled).length /
                            tenantStates.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-5 mb-5">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unmapped Features
            </h2>
            <p className="text-gray-600">
              Features Ids used by your application that are not mapped to
              features in Flagsmith
            </p>
          </div>
          <div className="flex gap-5">
            {availableIds.map((id) => (
              <Code>{id}</Code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagDashboard;
