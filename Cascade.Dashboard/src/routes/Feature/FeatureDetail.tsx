import React from "react";
import { LuCircleAlert, LuInfo, LuEllipsisVertical } from "react-icons/lu";
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
import ToggleButton from "../../components/ToggleButton";
import useFiltering from "../../hooks/useFiltering";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal";
import Button from "../../components/Button";

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  updatedAt: string;
};

export type Tenant = {
  id: string;
  name: string;
  url?: string;
};

export type TenantState = {
  tenantId: string;
  isEnabled: boolean;
  override: boolean;
};

const FeatureDetail = () => {
  const [isFilteringOverrides, setIsFilteringOverrides] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { featureId } = useParams();
  const navigate = useNavigate();
  const {
    availableTenants,
    availableFeatures,
    updateFeatureState,
    toggleOverride,
  } = useFeatureContext();

  const foundFeature = availableFeatures.find(
    (f) => f.feature.id === featureId
  );

  const { t } = useTranslation();

  const { filteredItems: tenants, setFilter: setSearchTerm } = useFiltering(availableTenants, (tenant) => [tenant.name, tenant.id]);
  const filteredTenants = tenants.filter(
    (tenant) => !isFilteringOverrides || foundFeature?.tenantStates.find((t) => t.tenantId === tenant.id)?.override);

  const tableCols: ColumnDefinition<Tenant>[] = React.useMemo(
    () => [
      {
        Cell: ({ item }) => {
          const tenantState = foundFeature?.tenantStates.find(
            (t) => t.tenantId === item.id
          );

          return (
            <ToggleButton
              action={async () =>
                await updateFeatureState(
                  featureId ?? "",
                  !tenantState?.isEnabled,
                  item.id
                )
              }
              isEnabled={tenantState?.isEnabled}
            />
          );
        },
        shrink: true,
      },
      {
        Cell: ({ item }) => (
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {item.id}
            </div>
          </div>
        ),
      },
      {
        Cell: ({ item }) =>
          foundFeature?.tenantStates.find((t) => t.tenantId === item.id)
            ?.override && (
            <div className="flex items-center gap-1 text-gray-500">
              <div className="text-sm text-gray-500">{t('FEATURE_DETAIL.TENANT_MANAGEMENT.OVERRIDDEN')}</div>
              <Tooltip text={t('FEATURE_DETAIL.TENANT_MANAGEMENT.OVERRIDDEN_TOOLTIP')}>
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
                    {t("FEATURE_DETAIL.MENU.TENANT_VIEW")}
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      toggleOverride(item.id, foundFeature?.feature.id ?? "");
                    }}
                  >
                    {foundFeature?.tenantStates.find(
                      (t) => t.tenantId === item.id
                    )?.override
                      ? t("FEATURE_DETAIL.MENU.REMOVE_OVERRIDE")
                      : t("FEATURE_DETAIL.MENU.OVERRIDE")}
                  </button>
                </>
              ),
            }}
          </Menu>
        ),
        shrink: true,
      },
    ],
    [featureId, foundFeature?.feature.id, foundFeature?.tenantStates, navigate, t, toggleOverride, updateFeatureState]
  );

  if (!foundFeature) return <p>{t('LOADING')}</p>;

  const { feature: selectedFlag, tenantStates } = foundFeature;

  const updatedDateTime = new Date(selectedFlag.updatedAt).toLocaleDateString() + " " + new Date(selectedFlag.updatedAt).toLocaleTimeString();

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Navbar backRoute="/features" />
            <div className="flex gap-5 items-start mb-6">
              <ToggleButton
                size="xl"
                action={() => setIsModalOpen(true)}
                isEnabled={selectedFlag.isEnabled}
              />
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedFlag.name}
                  </h1>
                  <Code>{selectedFlag.id}</Code>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>{selectedFlag.description}</p>
                  <span>
                    {t("FEATURE_DETAIL.LAST_UPDATED", { updatedDateTime })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2"></div>
            </div>

            <Alert className="mb-6" icon={<LuCircleAlert className="h-4 w-4" />}>
              {t("FEATURE_DETAIL.ENABLED_COUNT", { enabledCount: tenantStates.filter((ts) => ts.isEnabled).length, totalCount: tenantStates.length })}
            </Alert>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('FEATURE_DETAIL.TENANT_MANAGEMENT.TITLE')}</CardTitle>

              <div className="mt-2">
                <SearchBar
                  onChange={setSearchTerm}
                  placeholder={t('FEATURE_DETAIL.TENANT_MANAGEMENT.SEARCH_PLACEHOLDER')}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="pl-2 pt-2">
                <label>
                  <input
                    className="mr-3"
                    type="checkbox"
                    onChange={(x) => setIsFilteringOverrides(x.target.checked)}
                  />
                  {t('FEATURE_DETAIL.TENANT_MANAGEMENT.FILTER_OVERRIDDEN')}
                </label>
              </div>
              <DynamicTable items={filteredTenants} columns={tableCols} />
            </CardContent>
          </Card>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          <h2 className="text-xl font-bold">{t(`FEATURE_DETAIL.CONFIRMATION.TITLE.${!selectedFlag.isEnabled ? "ENABLE" : "DISABLE"}`)}</h2>
        </ModalHeader>
        <ModalBody>
          <p>
            {t(`FEATURE_DETAIL.CONFIRMATION.DESCRIPTION.${!selectedFlag.isEnabled ? "ENABLE" : "DISABLE"}`)}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={async () => {
            await updateFeatureState(
              selectedFlag.id,
              !selectedFlag.isEnabled
            );
            setIsModalOpen(false);
          }}
            variant={!selectedFlag.isEnabled ? "primary" : 'warn'}
          >{t(`FEATURE_DETAIL.CONFIRMATION.CONFIRM.${!selectedFlag.isEnabled ? "ENABLE" : "DISABLE"}`)}</Button>
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >{t('FEATURE_DETAIL.CONFIRMATION.CANCEL')}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FeatureDetail;
