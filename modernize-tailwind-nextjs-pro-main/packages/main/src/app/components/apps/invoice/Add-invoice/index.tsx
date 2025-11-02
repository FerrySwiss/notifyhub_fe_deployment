'use client'
import CardBox from "@/app/components/shared/CardBox";
import React from "react";
import CreateReminder from '@/app/components/apps/invoice/Add-invoice/create';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';

function CreateReminderApp() {
    return (
        <InvoiceProvider>
            <CardBox>
                <CreateReminder />
            </CardBox>
        </InvoiceProvider>
    )
}
export default CreateReminderApp;