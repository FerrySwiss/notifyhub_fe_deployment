'use client';
import React, { useEffect, useState } from "react";
import { Checkbox, Table, TextInput, Button, Modal, Badge, Tooltip, Alert } from "flowbite-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { reminderService } from "@/services/api";

function ReminderList() {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await reminderService.getReminders();
        setReminders(response.data);
      } catch (err) {
        setError("Failed to fetch reminders.");
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedReminders.map(id => reminderService.deleteReminder(id)));
      setReminders(reminders.filter(r => !selectedReminders.includes(r.id)));
      setSelectedReminders([]);
      setOpenDeleteDialog(false);
    } catch (err) {
      setError("Failed to delete reminders.");
    }
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedReminders(newSelectAll ? reminders.map(r => r.id) : []);
  };

  const toggleSelectReminder = (id: string) => {
    setSelectedReminders(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const filteredReminders = reminders.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading reminders...</div>;
  if (error) return <Alert color="failure">{error}</Alert>;

  return (
    <div className="overflow-x-auto">
      <div className="sm:flex justify-between my-6">
        <TextInput
          id="search"
          type="text"
          className="form-control"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button color={"primary"} className="sm:w-fit w-full rounded-md sm:mt-0 mt-4">
          <Link href="/apps/invoice/create">New Reminder</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell className="text-center">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {filteredReminders.map((reminder) => (
              <Table.Row key={reminder.id}>
                <Table.Cell className="p-4">
                  <Checkbox
                    checked={selectedReminders.includes(reminder.id)}
                    onChange={() => toggleSelectReminder(reminder.id)}
                  />
                </Table.Cell>
                <Table.Cell>{reminder.id}</Table.Cell>
                <Table.Cell>{reminder.title}</Table.Cell>
                <Table.Cell>{reminder.user?.name || 'N/A'}</Table.Cell>
                <Table.Cell>
                  {reminder.completed ? (
                    <Badge color="success">Completed</Badge>
                  ) : (
                    <Badge color="warning">Pending</Badge>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center gap-3">
                    <Tooltip content="Edit Reminder" placement="bottom">
                      <Link href={`/apps/invoice/edit/${reminder.id}`}>
                        <Button className="btn-circle p-0 mb-2 bg-lightsuccess text-success hover:bg-success hover:text-white">
                          <Icon icon="tabler:pencil" height={18} />
                        </Button>
                      </Link>
                    </Tooltip>
                    <Tooltip content="Delete Reminder" placement="bottom">
                      <Button
                        color={"lighterror"}
                        className="btn-circle p-0 mb-2"
                        onClick={() => {
                          setSelectedReminders([reminder.id]);
                          setOpenDeleteDialog(true);
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
      <Modal show={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} size="md">
        <Modal.Body>
          <p className="text-center text-lg text-ld">
            Are you sure you want to delete the selected reminders?
          </p>
        </Modal.Body>
        <Modal.Footer className="mx-auto">
          <Button color="lighterror" onClick={() => setOpenDeleteDialog(false)}>
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

export default ReminderList;