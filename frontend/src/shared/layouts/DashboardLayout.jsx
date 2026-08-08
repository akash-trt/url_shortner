import { Outlet, useMatches, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CreateLinkModal } from "@/features/links/components/CreateLinkModal";
import { useDisclosure } from "@/shared/hooks/useDisclosure";

export function DashboardLayout() {
  const createModal = useDisclosure(false);
  const sidebar = useDisclosure(false);
  const matches = useMatches();
  const location = useLocation();
  const title = matches.findLast((m) => m.handle?.title)?.handle?.title ?? "Dashboard";

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    sidebar.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-paper-50">
      <Sidebar onCreateClick={createModal.open} isOpen={sidebar.isOpen} onClose={sidebar.close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenuClick={sidebar.toggle} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet context={{ openCreateModal: createModal.open }} />
        </main>
      </div>
      <CreateLinkModal isOpen={createModal.isOpen} onClose={createModal.close} />
    </div>
  );
}
