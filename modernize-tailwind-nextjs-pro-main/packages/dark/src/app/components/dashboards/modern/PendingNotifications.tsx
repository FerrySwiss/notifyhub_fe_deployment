"use client"
import { useEffect, useState } from "react"
import { Badge, Table, Button, Spinner, Alert } from "flowbite-react"
import CardBox from "../../shared/CardBox"
import { Reminder } from "@/types/apps/invoice"
import Link from "next/link"
import { reminderService } from "@/app/services/api"

export const PendingNotifications = () => {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const fetchedReminders = await reminderService.getReminders()
                // Filter for pending notifications (active + future end date)
                const now = new Date()
                const pending = fetchedReminders.filter(
                    r => r.active && new Date(r.reminderEndDate) > now
                )
                setReminders(pending)
            } catch (err) {
                setError("Failed to fetch pending notifications.")
            } finally {
                setLoading(false)
            }
        }
        fetchReminders()
    }, [])

    if (loading) {
        return (
            <CardBox>
                <div className="flex justify-center items-center h-[200px]">
                    <Spinner size="xl" />
                </div>
            </CardBox>
        )
    }

    if (error) {
        return (
            <CardBox>
                <Alert color="failure">{error}</Alert>
            </CardBox>
        )
    }

    const renderTableRows = (data: Reminder[]) => (
        <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {data.map((item, index) => (
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
                            color="warning"
                            className="text-sm rounded-md py-1.1 px-2 w-11/12 justify-center"
                        >
                            Pending
                        </Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <p className="dark:text-darklink text-link text-sm">
                            {item.reminderEndDate}
                        </p>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    )

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
    )

    return (
        <CardBox>
            <>
                <div className="sm:flex items-center justify-between mb-6">
                    <div>
                        <h5 className="card-title">Pending Notifications</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Active reminders with upcoming due dates
                        </p>
                    </div>
                    <div className="sm:mt-0 mt-4">
                        <Link href="/apps/invoice/list?filter=pending">
                            <Button color="blue" size="sm" className="flex items-center justify-center rounded-md gap-3 !text-sm text-start leading-[normal] font-normal text-link dark:text-darklink dark:hover:text-primary !text-white hover:text-white bg-primary mb-0.5 hover:bg-primary">
                                View All
                            </Button>
                        </Link>
                    </div>
                </div>
                {reminders.length > 0 ? (
                    renderTable(reminders.slice(0, 5))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No pending notifications</p>
                    </div>
                )}
            </>
        </CardBox>
    )
}
