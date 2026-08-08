import { Users } from "lucide-react";
import { ComingSoonPage } from "./ComingSoonPage";

export default function TeamsPage() {
  return (
    <ComingSoonPage
      icon={<Users size={20} />}
      title="Teams aren't here yet"
      description="Every account is single-owner right now — inviting teammates and sharing link access isn't supported on the backend yet."
    />
  );
}
