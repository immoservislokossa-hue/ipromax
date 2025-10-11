
import { Suspense } from "react";
import ClientCommandesPage from "./ClientCommandesPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Chargement…</div>}>
      <ClientCommandesPage />
    </Suspense>
  );
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};
