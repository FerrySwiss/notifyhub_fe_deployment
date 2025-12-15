'use client'
import React, { Suspense } from 'react'
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

function InvoiceListContent() {
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter') || undefined;

    return <ReminderList filter={filter} />
}

function ListPage() {
    return (
        <>
            <BreadcrumbComp title="Notification List" items={BCrumb} />
            <CardBox>
                <Suspense fallback={<div>Loading...</div>}>
                    <InvoiceListContent />
                </Suspense>
            </CardBox>
        </>
    )
}
export default ListPage;