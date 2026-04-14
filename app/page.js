"use client";

import dynamic from "next/dynamic";

const ForgeAndField = dynamic(() => import("@/components/ForgeAndField"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", background: "#0f0e17" }}>
      <span style={{ color: "#f97316", fontFamily: "serif", fontSize: "1.2rem" }}>Lighting the forge...</span>
    </div>
  ),
});

export default function Home() {
  return <ForgeAndField />;
}
