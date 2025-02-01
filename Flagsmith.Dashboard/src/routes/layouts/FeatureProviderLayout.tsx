import { Outlet } from "react-router";
import FeatureContextProvider from "../../context/TenantContext";

const FeatureProviderLayout = () => {
  return (
    <FeatureContextProvider>
      <Outlet />
    </FeatureContextProvider>
  );
};

export default FeatureProviderLayout;
