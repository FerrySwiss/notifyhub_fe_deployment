"use client";
import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Table,
  TextInput,
  Button,
  Modal,
  Badge,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { mutate } from "swr";

// Dummy data for reminders
const dummyReminders = [
  {
    id: 101,
    assigned: "Rajesh Kumar",
    reminder: "Review marketing plan",
    priority: "Low",
    dueDate: "19 Sep 2025",
    status: "Pending",
  },
  {
    id: 102,
    assigned: "Priya Sharma",
    reminder: "Update website content",
    priority: "Medium",
    dueDate: "25 Sep 2025",
    status: "In Progress",
  },
  {
    id: 103,
    assigned: "Anil Verma",
    reminder: "Fix login issue",
    priority: "High",
    dueDate: "22 Sep 2025",
    status: "Completed",
  },
  {
    id: 104,
    assigned: "Kavita Singh",
    reminder: "Submit timesheet",
    priority: "Low",
    dueDate: "20 Sep 2025",
    status: "Pending",
  },
  {
    id: 105,
    assigned: "Manoj Patel",
    reminder: "Client meeting preparation",
    priority: "High",
    dueDate: "18 Sep 2025",
    status: "In Progress",
  },
];

function InvoiceList() {
  const [reminders, setReminders] = useState([]); // Start with an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedReminders, setSelectedReminders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Load reminders from sessionStorage on initial render
  useEffect(() => {
    const storedReminders = JSON.parse(sessionStorage.getItem('reminders'));
    if (storedReminders && storedReminders.length > 0) {
      setReminders(storedReminders);
    } else {
      setReminders(dummyReminders);
      sessionStorage.setItem('reminders', JSON.stringify(dummyReminders));
    }
  }, []);

  // Filter reminders based on search term and active tab
  const filteredReminders = reminders.filter(
    (reminder) =>
      (reminder.assigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.reminder.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "All" || reminder.status === activeTab)
  );

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Calculate the counts for different statuses
  const pendingCount = reminders.filter(
    (t) => t.status === "Pending"
  ).length;
  const inProgressCount = reminders.filter(
    (t) => t.status === "In Progress"
  ).length;
  const completedCount = reminders.filter(
    (t) => t.status === "Completed"
  ).length;

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    const selectAllValue = !selectAll;
    setSelectAll(selectAllValue);
    if (selectAllValue) {
      setSelectedReminders(filteredReminders.map((reminder) => reminder.id));
    } else {
      setSelectedReminders([]);
    }
  };

  // Toggle individual reminder selection
  const toggleSelectReminder = (reminderId) => {
    const index = selectedReminders.indexOf(reminderId);
    if (index === -1) {
      setSelectedReminders([...selectedReminders, reminderId]);
    } else {
      setSelectedReminders(selectedReminders.filter((id) => id !== reminderId));
    }
  };

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected reminders
  const handleConfirmDelete = () => {
    const updatedReminders = reminders.filter(
      (reminder) => !selectedReminders.includes(reminder.id)
    );
    setReminders(updatedReminders);
    sessionStorage.setItem('reminders', JSON.stringify(updatedReminders)); // Update sessionStorage
    setSelectedReminders([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Dummy logic to simulate data reset on refresh
  const location = usePathname();
  const handleResetReminders = async () => {
    setReminders(dummyReminders);
    sessionStorage.setItem('reminders', JSON.stringify(dummyReminders));
    await mutate("/api/reminders");
  };

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      sessionStorage.removeItem("isPageRefreshed");
      handleResetReminders();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  return (
    <div className="overflow-x-auto">
      {/* Summary sections for reminders */}
      <div className="flex justify-between overflow-x-auto gap-6">
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-md hover:bg-lightprimary dark:hover:bg-lightprimary ${
            activeTab === "All" ? "bg-lightprimary dark:bg-lightprimary" : null
          }`}
          onClick={() => handleTabClick("All")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-primary text-primary flex justify-center items-center">
            <Icon icon="tabler:align-box-right-stretch" height={25} />
          </div>
          <div>
            <h5 className="text-base">Total</h5>
            <p className="text-darklink">{reminders.length} reminders</p>
            <h6 className="text-sm">Active Reminders</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-md hover:bg-lightprimary dark:hover:bg-lightprimary ${
            activeTab === "In Progress" ? "bg-lightprimary dark:bg-lightprimary" : null
          }`}
          onClick={() => handleTabClick("In Progress")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-secondary text-secondary flex justify-center items-center">
            <Icon icon="tabler:map-pin" height={25} />
          </div>
          <div>
            <h5 className="text-base">In Progress</h5>
            <p className="text-darklink">{inProgressCount} reminders</p>
            <h6 className="text-sm">In Progress</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-md hover:bg-lightprimary dark:hover:bg-lightprimary ${
            activeTab === "Completed" ? "bg-lightprimary dark:bg-lightprimary" : null
          }`}
          onClick={() => handleTabClick("Completed")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-success text-success flex justify-center items-center">
            <Icon icon="tabler:shield" height={25} />
          </div>
          <div>
            <h5 className="text-base">Completed</h5>
            <p className="text-darklink">{completedCount} reminders</p>
            <h6 className="text-sm">Completed</h6>
          </div>
        </div>
        <div
          className={`flex gap-3 items-center sm:w-3/12 w-full mb-2 cursor-pointer p-5 rounded-md hover:bg-lightprimary dark:hover:bg-lightprimary ${
            activeTab === "Pending" ? "bg-lightprimary dark:bg-lightprimary" : null
          }`}
          onClick={() => handleTabClick("Pending")}
        >
          <div className="h-14 w-14 rounded-full border-2 border-warning text-warning flex justify-center items-center">
            <Icon icon="tabler:camera-minus" height={25} />
          </div>
          <div>
            <h5 className="text-base">Pending</h5>
            <p className="text-darklink">{pendingCount} reminders</p>
            <h6 className="text-sm">Pending</h6>
          </div>
        </div>
      </div>
      <div className="sm:flex justify-between my-6">
        <div>
          <TextInput
            id="search"
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            icon={() => <Icon icon="tabler:search" height={18} />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button color={"primary"} className="sm:w-fit w-full rounded-md sm:mt-0 mt-4">
          <Link href="/apps/invoice/create">New Reminder</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox
                className="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>ASSIGNED</Table.HeadCell>
            <Table.HeadCell>REMINDER</Table.HeadCell>
            <Table.HeadCell>PRIORITY</Table.HeadCell>
            <Table.HeadCell>DUE DATE</Table.HeadCell>
            <Table.HeadCell>STATUS</Table.HeadCell>
            <Table.HeadCell className="text-center">ACTION</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {filteredReminders.map((reminder) => (
              <Table.Row key={reminder.id}>
                <Table.Cell className="p-4">
                  <Checkbox
                    className="checkbox"
                    onChange={() => toggleSelectReminder(reminder.id)}
                    checked={selectedReminders.includes(reminder.id)}
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  <h5 className="text-sm">{reminder.id}</h5>
                </Table.Cell>
                <Table.Cell>
                  <h5 className="text-sm">{reminder.assigned}</h5>
                </Table.Cell>
                <Table.Cell className="text-ld">{reminder.reminder}</Table.Cell>
                <Table.Cell>
                  {reminder.priority === "High" ? (
                    <Badge color="failure" className="rounded-md">
                      {reminder.priority}
                    </Badge>
                  ) : reminder.priority === "Medium" ? (
                    <Badge color="warning" className="rounded-md">
                      {reminder.priority}
                    </Badge>
                  ) : (
                    <Badge color="primary" className="rounded-md">
                      {reminder.priority}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>{reminder.dueDate}</Table.Cell>
                <Table.Cell>
                  {reminder.status === "Completed" ? (
                    <Badge color="success" className="rounded-md">
                      {reminder.status}
                    </Badge>
                  ) : reminder.status === "In Progress" ? (
                    <Badge color="info" className="rounded-md">
                      {reminder.status}
                    </Badge>
                  ) : (
                    <Badge color="warning" className="rounded-md">
                      {reminder.status}
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center gap-3">
                    <Tooltip content="Edit Reminder" placement="bottom">
                      <Button className="btn-circle p-0 mb-2 bg-lightsuccess  text-success hover:bg-success hover:text-white">
                        <Link href={`/apps/invoice/edit-reminder/${reminder.id}`}>
                          <Icon icon="tabler:pencil" height={18} />
                        </Link>
                      </Button>
                    </Tooltip>
                    <Tooltip content="View Reminder" placement="bottom">
                      <Button
                        color={"lightprimary"}
                        className="btn-circle p-0 mb-2"
                      >
                        <Link
                          href={`/apps/invoice/detail-reminder/${reminder.id}`}
                        >
                          <Icon icon="tabler:eye" height={18} />
                        </Link>
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete Reminder" placement="bottom">
                      <Button
                        color={"lighterror"}
                        className="btn-circle p-0 mb-2"
                        onClick={() => {
                          setSelectedReminders([reminder.id]);
                          handleDelete();
                        }}
                      >
                        <Icon icon="tabler:trash" height={18} />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Modal show={openDeleteDialog} onClose={handleCloseDeleteDialog} size={"md"}>
        <Modal.Body>
          <p className="text-center text-lg text-ld">
            Are you sure you want to delete selected reminders?
          </p>
        </Modal.Body>
        <Modal.Footer className="mx-auto">
          <Button color="lighterror" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


export default InvoiceList;