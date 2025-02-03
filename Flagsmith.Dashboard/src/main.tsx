import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import FeatureFlagDashboard from "./routes/Feature/FeatureFlagDashboard.tsx";
import FeatureDetail from "./routes/Feature/FeatureDetail.tsx";
import TenantDetail from "./routes/Tenant/TenantDetail.tsx";
import FeatureProviderLayout from "./routes/layouts/FeatureProviderLayout.tsx";
import TenantDashboard from "./routes/Tenant/TenantDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/flagsmith">
      <Routes>
        <Route element={<FeatureProviderLayout />}>
          <Route path="features">
            <Route index element={<FeatureFlagDashboard />} />
            <Route path=":featureId" element={<FeatureDetail />} />
          </Route>
          <Route path="tenants">
            <Route index element={<TenantDashboard />} />
            <Route path=":tenantId" element={<TenantDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/features" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
