import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import { LuChartBar } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFeatureContext } from "../../context/useTenants";
import NavTabs, { NavTab } from "../../components/Tabs";
import OrganisationIcon from "../../components/OrganisationIcon";
import useFiltering from "../../hooks/useFiltering";
import SearchBar from "../../components/SearchBar";
import { useTranslation } from "react-i18next";

const TenantDashboard = () => {
  const navigate = useNavigate();

  const { availableTenants, availableFeatures } = useFeatureContext();
  const { filteredItems: tenants, setFilter: setSearchTerm } = useFiltering(availableTenants, (tenant) => [tenant.name, tenant.id]);

  const { t } = useTranslation();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <NavTabs initialActiveTab="tenants">
            <NavTab route="/features">{t('FEATURE_DASHBOARD.TAB')}</NavTab>
            <NavTab route="/tenants">{t('TENANT_DASHBOARD.TAB')}</NavTab>
          </NavTabs>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('TENANT_DASHBOARD.TITLE')}
          </h1>
          <p className="text-gray-600">
            {t('TENANT_DASHBOARD.SUBTITLE')}
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            placeholder={t('TENANT_DASHBOARD.SEARCH_PLACEHOLDER')}
            onChange={(term) => setSearchTerm(term)}
          />
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
                      <CardDescription>{t('TENANT_DASHBOARD.CARD.ID', { tenantId: tenant.id })}</CardDescription>
                    </div>
                    <div className="p-2 rounded-full bg-gray-100">
                      <OrganisationIcon text={tenant.name} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <LuChartBar className="w-4 h-4" />
                        {t('TENANT_DASHBOARD.CARD.USAGE')}
                      </span>
                      <span className="font-medium">
                        {t('TENANT_DASHBOARD.CARD.ENABLED_COUNT', {
                          enabledCount: enabledFeatures.length,
                          totalCount: availableFeatures.length,
                        })}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(enabledFeatures.length /
                            availableFeatures.length) *
                            100
                            }%`,
                        }}
                      />
                    </div>

                    {overriddenFeatures.length > 0 && (
                      <div className="text-sm text-amber-600">
                        {t('TENANT_DASHBOARD.CARD.OVERRIDDEN_COUNT', { count: overriddenFeatures.length })}
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
