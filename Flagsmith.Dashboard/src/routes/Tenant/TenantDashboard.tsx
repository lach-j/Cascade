import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import { LuChartBar, LuSearch, LuSettings } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFeatureContext } from "../../context/useTenants";
import NavTabs, { NavTab } from "../../components/Tabs";

const TenantDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const { availableTenants, availableFeatures } = useFeatureContext();

  const tenants = availableTenants?.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            Tenant Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all tenant configurations
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants?.map((tenant) => {
            const enabledFeatures = availableFeatures
              .map(({ tenantStates }) =>
                tenantStates.find((ts) => ts.tenantId === tenant.id)
              )
              .filter((ts) => ts?.isEnabled);

            const overriddenFeatures = availableFeatures
              .map(({ tenantStates }) =>
                tenantStates.find((ts) => ts.tenantId === tenant.id)
              )
              .filter((ts) => ts?.override);

            return (
              <Card
                key={tenant.id}
                className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/tenants/${tenant.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">
                        {tenant.name}
                      </CardTitle>
                      <CardDescription>ID: {tenant.id}</CardDescription>
                    </div>
                    <button
                      title="Open Settings"
                      className="p-2 rounded-full bg-gray-100"
                    >
                      <LuSettings className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <LuChartBar className="w-4 h-4" />
                        Feature Usage
                      </span>
                      <span className="font-medium">
                        {enabledFeatures.length}/{availableFeatures.length}{" "}
                        features
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (enabledFeatures.length /
                              availableFeatures.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    {overriddenFeatures.length > 0 && (
                      <div className="text-sm text-amber-600">
                        {overriddenFeatures.length} overridden feature
                        {overriddenFeatures.length === 1 ? "" : "s"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
