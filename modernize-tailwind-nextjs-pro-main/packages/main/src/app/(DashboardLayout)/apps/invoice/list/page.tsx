import React from 'react'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import ReminderList from '@/app/components/apps/invoice/Invoice-list/index'
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
function ListPage() {
    return (
        <>
            <BreadcrumbComp title="Reminder List" items={BCrumb} />
            <CardBox>
                <ReminderList />
            </CardBox>
        </>
    )
}
export default ListPage;