import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import React from "react";
import type { Metadata } from "next";
import CreateReminderPage from "@/app/components/apps/invoice/Add-invoice/create";

export const metadata: Metadata = {
  title: "Create a new reminder",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Create a new Reminder",
  },
];
function CreatePage() {
  return (
    <>
      <BreadcrumbComp title=" Create A New Reminder " items={BCrumb} />
      <CreateReminderPage />
    </>
  );
}
export default CreatePage;