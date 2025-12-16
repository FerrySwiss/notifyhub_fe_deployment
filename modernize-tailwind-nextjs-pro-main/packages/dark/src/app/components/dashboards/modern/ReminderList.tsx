"use client"
import { Badge, Table, Button } from "flowbite-react"
import CardBox from "../../shared/CardBox"
import { Reminder } from "@/types/apps/invoice";
import Link from "next/link";
import React, { useContext } from "react";
import { UserDataContext } from "@/app/context/UserDataContext";

export const ReminderList = () => {
    const { reminders, loading, error } = useContext(UserDataContext);
    
    // Default to empty array if undefined
    const activeReminders = reminders ? reminders.filter(r => r.active) : [];

    if (error) return <div>Error: {error.message}</div>
    if (loading && !reminders) return <div>Loading...</div>

    const renderTableRows = (data: Reminder[]) => (
        <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {data.length > 0 ? (
                data.map((item, index) => (
                    <Table.Row key={index}>
                        <Table.Cell className="whitespace-nowrap ps-0 md:min-w-auto min-w-[200px]">
                            <h6 className="text-sm font-semibold mb-1">{item.title}</h6>
                        </Table.Cell>
                        <Table.Cell>
                            <p className="text-link dark:text-darklink text-sm w-fit">
                                {item.description}
                            </p>
                        </Table.Cell>
                        <Table.Cell>
                            <Badge 
                                color={`${item.active ? "success" : "failure"}`}
                                className="text-sm rounded-md py-1.1 px-2 w-11/12 justify-center"
                            >
                                {item.active ? "Active" : "Inactive"}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <p className="dark:text-darklink text-link text-sm">
                                {item.reminderEndDate}
                            </p>
                        </Table.Cell>
                    </Table.Row>
                ))
            ) : (
                <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                        No active notifications found.
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    );

    const renderTable = (data: Reminder[]) => (
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="overflow-x-auto">
                        <Table>
                            <Table.Head>
                                <Table.HeadCell className="text-sm font-semibold ps-0">
                                    Title
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Description
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Status
                                </Table.HeadCell>
                                <Table.HeadCell className="text-sm font-semibold">
                                    Due Date
                                </Table.HeadCell>
                            </Table.Head>
                            {renderTableRows(data)}
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <CardBox>
            <>
                <div className="sm:flex items-center justify-between mb-6">
                    <div>
                        <h5 className="card-title">Notification List</h5>
                    </div>
                    <div className="sm:mt-0 mt-4 flex gap-2">
                        <Link href="/apps/invoice/create">
                             <Button color="primary" size="sm">
                                Create
                            </Button>
                        </Link>
                        <Link href="/apps/invoice/list">
                            <Button color="lightprimary" size="sm">
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>
                {renderTable(activeReminders.slice(0, 5))}
            </>
        </CardBox>
    )
}