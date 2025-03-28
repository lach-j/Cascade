import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import {
  LuChartBar,
  LuPlus,
  LuTriangleAlert,
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { useFeatureContext } from "../../context/useTenants";
import NavTabs, { NavTab } from "../../components/Tabs";
import Code from "../../components/Code";
import Tooltip from "../../components/Tooltip";
import useFiltering from "../../hooks/useFiltering";
import ToggleButton from "../../components/ToggleButton";
import SearchBar from "../../components/SearchBar";

const FeatureFlagDashboard = () => {
  const navigate = useNavigate();

  const { availableFeatures, availableIds, knownIds, bulkCreateMissing } =
    useFeatureContext();

  const {
    filteredItems: flags,
    setFilter: setSearchTerm,
  } = useFiltering(availableFeatures, (feature) => [
    feature.feature.name,
    feature.feature.id,
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <NavTabs initialActiveTab="tenants">
            <NavTab route="/features">Features</NavTab>
            <NavTab route="/tenants">Tenants</NavTab>
          </NavTabs>
          <h1 className={styles.heading}>
            Feature Flag Management
          </h1>
          <p className={styles.subheading}>
            Manage feature flags across all tenants
          </p>
        </div>
        <div className={styles.searchContainer}>
          <SearchBar
            placeholder="Search features..."
            onChange={(term) => setSearchTerm(term)}
            />
        </div>

        <div className={styles.grid}>
          {flags?.map(({ feature: flag, tenantStates }) => (
            <Card
              key={flag.id}
              className={styles.card}
              onClick={() => navigate(`/features/${flag.id}`)}
            >
              <CardHeader className={styles.cardHeader}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className={styles.cardTitle}>
                      {flag.name}{" "}
                      {!knownIds.some((id) => id === flag.id) && (
                        <Tooltip text="This feature does not correspond to any ID configured in the application">
                          <LuTriangleAlert className="text-yellow-500" />
                        </Tooltip>
                      )}
                    </CardTitle>
                    <CardDescription>{flag.description}</CardDescription>
                  </div>
                  <ToggleButton
                    isReadOnly
                    isEnabled={flag.isEnabled}
                    className="rounded-full"
                  />
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
        {availableIds.length > 0 && (
          <div className="mt-5 mb-5">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Unmapped Features
                </h2>
                <p className="text-gray-600">
                  Feature IDs used by your application that are not mapped to
                  features in Cascade
                </p>
              </div>
              <button
                onClick={bulkCreateMissing}
                className="flex items-center gap-2 px-2 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <LuPlus className="w-5 h-5" />
                Create All Missing
              </button>
            </div>
            <div className="flex gap-5 flex-wrap">
              {availableIds.map((id) => (
                <Code key={id}>{id}</Code>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: "p-6 bg-gray-50 min-h-screen",
  container: "max-w-6xl mx-auto",
  header: "mb-8",
  heading: "text-3xl font-bold text-gray-900 mb-2",
  subheading: "text-gray-600",
  searchContainer: "mb-6",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  card: "shadow-sm cursor-pointer hover:shadow-md transition-shadow",
  cardHeader: "pb-4",
  cardTitle: "text-lg font-semibold mb-1 flex items-center gap-2",
};

export default FeatureFlagDashboard;
