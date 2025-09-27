import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import React from "react";
import type { Metadata } from "next";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
export const metadata: Metadata = {
  title: "create a new reminder",
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
function CreateList() {
  return (
    <>
      <BreadcrumbComp title=" Create A New Reminder " items={BCrumb} />
      <CreateInvoiceApp />
    </>
  );
}
export default CreateList;
