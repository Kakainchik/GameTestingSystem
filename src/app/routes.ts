import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { ServersPage } from "./pages/ServersPage";
import { CollectedDataPage } from "./pages/CollectedDataPage";
import { ApiDocsPage } from "./pages/ApiDocsPage";
import { PluginSetupPage } from "./pages/PluginSetupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "servers", Component: ServersPage },
      { path: "data", Component: CollectedDataPage },
      { path: "docs", Component: ApiDocsPage },
      { path: "plugin-setup", Component: PluginSetupPage },
    ],
  },
]);
