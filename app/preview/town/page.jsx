"use client";

// Sealed prototype route — Track B Iter 1 (see docs/TWO_TRACK_PLAN.md).
// No header, nav, or game state on purpose: the camera feel must be judged
// against an empty canvas before pixel art lands in Iter 2.
import TownPrototype from "../../../components/town/TownPrototype";

export default function TownPreviewPage() {
  return <TownPrototype />;
}
