'use client';
import React, { useState, useEffect } from "react";
import { Alert, Button, Label, Checkbox, TextInput } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";
import { reminderService } from "@/services/api";

const EditReminderPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reminder, setReminder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathName = usePathname();
  const reminderId = pathName.split("/").pop();

  useEffect(() => {
    const fetchReminder = async () => {
      if (!reminderId) return;
      try {
        const fetchedReminder = await reminderService.getReminderById(reminderId);
        setReminder(fetchedReminder);
      } catch (err: any) {
        setError("Failed to fetch reminder data.");
        console.error("Error fetching reminder:", err);
      }
    };
    fetchReminder();
  }, [reminderId]);

  const handleSave = async () => {
    if (!reminder) return;
    try {
      const updatedReminder = await reminderService.updateReminder({
        id: reminder.id,
        title: reminder.title,
        completed: reminder.completed,
      });
      setReminder(updatedReminder);
      setEditing(false);
      setShowAlert(true);
      setTimeout(() => router.push('/apps/invoice/list'), 2000);
    } catch (error) {
      console.error("Error updating reminder:", error);
      setError("Failed to update reminder.");
    }
  };

  const handleCancel = () => {
    // A better implementation would re-fetch the original data
    setEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setReminder({ ...reminder, [field]: value });
  };

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  if (!reminder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl mb-2">Edit Reminder</h2>
      <p>ID: {reminder.id}</p>

      <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="mb-2 block">
              <Label htmlFor="title" value="Title" />
            </div>
            <TextInput
              id="title"
              name="title"
              value={reminder.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="form-control"
              disabled={!editing}
            />
          </div>
          <div className="col-span-12">
            <div className="flex items-center gap-2">
              <Checkbox
                id="completed"
                name="completed"
                checked={reminder.completed}
                onChange={(e) => handleInputChange("completed", e.target.checked)}
                disabled={!editing}
              />
              <Label htmlFor="completed">Completed</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        {editing ? (
          <div className="flex justify-end gap-3">
            <Button color={"success"} className="rounded-md" onClick={handleSave}>
              Save
            </Button>
            <Button color={"error"} className="rounded-md" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button color={"info"} className="rounded-md" onClick={() => setEditing(true)}>
            Edit Reminder
          </Button>
        )}
      </div>

      {showAlert && (
        <Alert color="success" rounded className="fixed top-3 !text-white z-[50]">
          Reminder data updated successfully.
        </Alert>
      )}
    </div>
  );
};

export default EditReminderPage;