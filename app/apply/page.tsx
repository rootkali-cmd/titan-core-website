import type { Metadata } from "next";

import { ApplicationForm } from "@/components/application-form";

export const metadata: Metadata = {
  title: "التقديم",
};

export default function ApplyPage() {
  return <ApplicationForm />;
}
