import React from "react";
import {
  FeatureFlag,
  Tenant,
  TenantState,
} from "../routes/Feature/FeatureDetail";

export const useFeatureContext = () => {
  const context = React.useContext<FeatureContextType>(FeatureContext);
  if (!context) {
    throw new Error(
      "useFeatureContext must be used within a FeatureContextProvider"
    );
  }
  return context;
};

export type FeatureContextType = {
  availableTenants: Tenant[];
  availableFeatures: {
    feature: FeatureFlag;
    tenantStates: TenantState[];
  }[];
  updateFeatureState: (
    featureId: string,
    enabled: boolean,
    tenantId?: string
  ) => Promise<void>;
  availableIds: string[];
  toggleOverride: (tenantId: string, featureId: string) => Promise<void>;
};

export const FeatureContext = React.createContext<FeatureContextType>({
  availableTenants: [],
  availableFeatures: [],
  updateFeatureState: () => new Promise((res) => res),
  availableIds: [],
  toggleOverride: () => new Promise((res) => res),
});
