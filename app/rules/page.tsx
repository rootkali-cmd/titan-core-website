import type { Metadata } from "next";

import { RulesPageContent } from "@/components/rules-page-content";

export const metadata: Metadata = {
  title: "قواعد الفريق",
};

export default function RulesPage() {
  return <RulesPageContent />;
}
