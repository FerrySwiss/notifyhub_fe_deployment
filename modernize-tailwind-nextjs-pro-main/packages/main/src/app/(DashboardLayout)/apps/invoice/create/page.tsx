import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import React from "react";
import type { Metadata } from "next";
import CreateReminderApp from "@/app/components/apps/invoice/Add-invoice";
export const metadata: Metadata = {
  title: "Create Reminder",
};
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Create Reminder",
  },
];
function CreateReminderPage() {
  return (
    <>
      <BreadcrumbComp title="Create A New Reminder" items={BCrumb} />
      <CreateReminderApp />
    </>
  );
}
export default CreateReminderPage;