'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import CardBox from "@/app/components/shared/CardBox";
import BreadcrumbComp from "@/app/(DashboardLayout)/layout/shared/breadcrumb/BreadcrumbComp";
import ReminderList from '@/app/components/apps/invoice/Invoice-list/index'

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Notification List",
    },
];

function ListPage() {
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || undefined;

    return (
        <>
            <BreadcrumbComp title="Notification List" items={BCrumb} />
            <CardBox>
                <ReminderList filter={filter} />
            </CardBox>
        </>
    )
}
export default ListPage;