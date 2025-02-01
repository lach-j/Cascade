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
    tenantId?: number
  ) => Promise<void>;
  availableIds: string[];
};

export const FeatureContext = React.createContext<FeatureContextType>({
  availableTenants: [],
  availableFeatures: [],
  updateFeatureState: () => new Promise((res) => res),
  availableIds: [],
});
