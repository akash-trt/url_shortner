import { Globe } from "lucide-react";
import { ComingSoonPage } from "./ComingSoonPage";

export default function DomainsPage() {
  return (
    <ComingSoonPage
      icon={<Globe size={20} />}
      title="Custom domains aren't live yet"
      description="Bringing your own domain (like go.yourbrand.com) instead of gourl.co isn't wired up on the backend yet — it's on the list."
    />
  );
}
