"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import {
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
  Tabs, 
  TextInput,
} from "flowbite-react";

export const GET_REMINDERS = gql`
  query GetReminders {
    todos(options: { paginate: { page: 1, limit: 20 } }) {
      data {
        id
        title
        completed
      }
    }
  }
`;

interface Reminder {
  id: string;
  title: string;
  completed: boolean;
}

const InvoiceList = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_REMINDERS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");


  if (loading)
    return (
      <div className="flex justify-center p-6">
        <Spinner size="xl" />
      </div>
    );

  if (error)
    return <Alert color="failure">Error: {error.message}</Alert>;

  const reminders: Reminder[] = data?.todos?.data || [];



  
  const filteredReminders = reminders
    .filter((r) =>
      filter === "all" ? true : filter === "completed" ? r.completed : !r.completed
    )
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reminders</h2>

      
      <Tabs
        aria-label="Reminder tabs"
        variant="underline"
        onActiveTabChange={(index) => {
          if (index === 0) setFilter("all");
          if (index === 1) setFilter("pending");
          if (index === 2) setFilter("completed");
        }}
      >
        <Tabs.Item title="All" />
        <Tabs.Item title="Pending" />
        <Tabs.Item title="Completed" />
      </Tabs>

     
      <div className="mt-4 flex justify-between items-center">
        <TextInput
          placeholder="Search reminders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => router.push("/apps/invoice/create")}>
          + New Reminder
        </Button>
      </div>

     
      {filteredReminders.length === 0 ? (
        <p className="text-gray-500 mt-6">No reminders found.</p>
      ) : (
        <Table className="mt-6">
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Sender Email</Table.HeadCell>
            <Table.HeadCell>Sender Name</Table.HeadCell>
            <Table.HeadCell>Receiver Email</Table.HeadCell>
            <Table.HeadCell>Interval Type</Table.HeadCell>
            <Table.HeadCell>Start Date</Table.HeadCell>
            <Table.HeadCell>End Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredReminders.map((reminder) => (
              <Table.Row key={reminder.id}>
                <Table.Cell>{reminder.title}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>{"-"}</Table.Cell>
                <Table.Cell>
                  {reminder.completed ? (
                    <Badge color="success">Completed</Badge>
                  ) : (
                    <Badge color="warning">Pending</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default InvoiceList;
