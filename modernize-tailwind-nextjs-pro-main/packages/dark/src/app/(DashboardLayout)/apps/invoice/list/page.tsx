
import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import InvoiceList from '@/app/components/apps/invoice/Invoice-list/index'
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reminder List",
};
const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Reminder List",
    },
];
function List() {
    return (
        <InvoiceProvider>
            <BreadcrumbComp title="Reminder List" items={BCrumb} />
            <CardBox>
                <InvoiceList />
            </CardBox>
        </InvoiceProvider>
    )
}
export default List;
