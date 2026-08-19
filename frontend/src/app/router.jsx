import { createBrowserRouter } from "react-router-dom";
import { MarketingLayout } from "@/shared/layouts/MarketingLayout";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { RequireAuth } from "./RequireAuth";
import { RequireGuest } from "./RequireGuest";

import LandingPage from "@/pages/marketing/LandingPage";
import PricingPage from "@/pages/marketing/PricingPage";
import DocsPage from "@/pages/marketing/DocsPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import LinksPage from "@/pages/dashboard/LinksPage";
import LinkDetailPage from "@/pages/dashboard/LinkDetailPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import DomainsPage from "@/pages/dashboard/DomainsPage";
import TeamsPage from "@/pages/dashboard/TeamsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RedirectHandler from "@/pages/RedirectHandler";

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/docs", element: <DocsPage /> },
    ],
  },
  {
    element: <RequireGuest />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OverviewPage />, handle: { title: "Overview" } },
          { path: "links", element: <LinksPage />, handle: { title: "Links" } },
          {
            path: "links/:shortCode",
            element: <LinkDetailPage />,
            handle: { title: "Link details" },
          },
          { path: "analytics", element: <AnalyticsPage />, handle: { title: "Analytics" } },
          { path: "domains", element: <DomainsPage />, handle: { title: "Domains" } },
          { path: "teams", element: <TeamsPage />, handle: { title: "Teams" } },
          { path: "settings", element: <SettingsPage />, handle: { title: "Settings" } },
        ],
      },
    ],
  },
  { path: "/:shortCode", element: <RedirectHandler /> },
  { path: "*", element: <NotFoundPage /> },
]);
