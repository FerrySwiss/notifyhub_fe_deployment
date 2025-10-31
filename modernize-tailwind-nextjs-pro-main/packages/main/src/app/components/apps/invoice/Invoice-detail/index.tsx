'use client';
import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Badge, Button } from "flowbite-react";
import { format, isValid, parseISO } from "date-fns";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/FullLogo";

const ReminderDetail = () => {
  const { invoices } = useContext(InvoiceContext);
  const [selectedReminder, setSelectedReminder]: any = useState(null);

  const pathName = usePathname();
  const getTitle = pathName.split("/").pop();

  useEffect(() => {
    if (invoices.length > 0) {
      if (getTitle) {
        const reminder = invoices.find(
          (p: { title: string }) => p.title === getTitle
        );
        if (reminder) {
          setSelectedReminder(reminder);
        } else {
          setSelectedReminder(invoices[0]);
        }
      } else {
        setSelectedReminder(invoices[0]);
      }
    }
  }, [getTitle, invoices]);

  if (!selectedReminder) {
    return <div>Loading...</div>;
  }

  const reminderEndDate = selectedReminder.reminderEndDate
    ? (isValid(parseISO(selectedReminder.reminderEndDate))
      ? format(parseISO(selectedReminder.reminderEndDate), "EEEE, MMMM dd, yyyy")
      : "Invalid Date")
    : format(new Date(), "EEEE, MMMM dd, yyyy");

  return (
    <>
      <div className="sm:flex justify-between items-start mb-6">
        <FullLogo />
        <div className="md:text-end md:mt-0 mt-5">
          <Badge color={"success"}>{selectedReminder.status}</Badge>
          <h3 className="items-center mt-1 text-xl"># {selectedReminder.id}</h3>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="md:col-span-6 col-span-12">
          <h4 className="text-lg font-bold">{selectedReminder.title}</h4>
          <p className="my-2">{selectedReminder.description}</p>
          <h6 className="text-base font-medium mt-4">Sender Details:</h6>
          <p>Name: {selectedReminder.senderName}</p>
          <p>Email: {selectedReminder.senderEmail}</p>
        </div>
        <div className="md:col-span-6 col-span-12 flex md:justify-end">
          <div className="md:text-right">
            <h6 className="text-base font-medium">Reminder Details:</h6>
            <p>Interval: {selectedReminder.intervalType}</p>
            <p>Time: {selectedReminder.sendReminderAt}</p>
            <p>End Date: {reminderEndDate}</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h6 className="text-base font-medium">Receivers:</h6>
        <p>{selectedReminder.receiverEmail}</p>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button color={"warning"} className="rounded-md">
          <Link href={`/apps/invoice/edit/${selectedReminder.title}`}>
            Edit Reminder
          </Link>
        </Button>
        <Button color="primary" className="rounded-md">
          <Link href="/apps/invoice/list">Back to Reminder List</Link>
        </Button>
      </div>
    </>
  );
};
export default ReminderDetail;