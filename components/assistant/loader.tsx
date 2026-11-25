"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Assistant = dynamic(() => import("./assistant"), { ssr: false });

export default function AssistantLoader() {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <Assistant page={path === "/" ? "home" : path.slice(1)} />;
}
