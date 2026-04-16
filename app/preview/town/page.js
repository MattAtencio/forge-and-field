"use client";

import dynamic from "next/dynamic";

const TownPrototype = dynamic(() => import("@/components/TownPrototype"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
      background: "#2a2438",
      color: "#f97316",
      fontFamily: "serif",
    }}>
      Loading town...
    </div>
  ),
});

export default function TownPreviewPage() {
  return <TownPrototype />;
}
